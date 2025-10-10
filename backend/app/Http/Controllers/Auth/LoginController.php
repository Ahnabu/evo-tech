<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\AdminResource;
use App\Http\Resources\User\UserResource;
use App\Models\Account;
use App\Models\Admin;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class LoginController extends Controller
{

    public function signin(Request $request)
    {
        try {
            $valRules = [
                'email' => 'required|email|max:255',
                'password' => 'required|string',
                'role' => 'nullable|string|in:USER,ADMIN',
            ];

            $validator = Validator::make($request->all(), $valRules);

            if ($validator->fails()) {
                return response()->json([
                    'message' => $validator->errors()->first(),
                ], 400); // bad request
            }

            $userRole = $request->input('role', 'USER');

            if ($userRole === "ADMIN") {
                $user = Admin::where('email', $request->input('email'))->first();
            } else {
                $user = User::where('email', $request->input('email'))->first();
            }

            if (!$user || !$user->password) {
                return response()->json([
                    'user' => null,
                    'message' => "invalid credentials"
                ], 401);
            }

            if (!Hash::check($request->input('password'), $user->password)) {
                return response()->json([
                    'user' => null,
                    'message' => "invalid credentials"
                ], 401);
            }

            // based on user role, return formatted user's data
            if ($userRole === "ADMIN") {
                $userdata = new AdminResource($user);
            } else {
                $userdata = new UserResource($user);
            }

            return response()->json([
                'user' => $userdata,
                'message' => "success",
            ], 200);
            // try end
        } catch (\Exception $e) {
            // Logging the exception for debugging
            Log::error('Error signing in: ' . $e->getMessage());

            return response()->json(['message' => 'An error occurred while signing in'], 500);
        }
    }



    public function oauthSignin(Request $request)
    {

        try {
            $valRules = [
                // Validate account object
                'account' => 'required|array',
                'account.type' => 'required|string', // Allowed types from Auth.js
                'account.provider' => 'required|string',
                'account.providerAccountId' => 'required|string',
                'account.access_token' => 'required|string',
                'account.refresh_token' => 'nullable|string',
                'account.expires_at' => 'required|integer|min:1',
                'account.token_type' => 'required|string',
                'account.scope' => 'nullable|string',
                'account.id_token' => 'nullable|string',

                // Validate profile object
                'profile' => 'required|array',
                'profile.firstname' => 'required|string|max:255',
                'profile.lastname' => 'nullable|string|max:255',
                'profile.email' => 'required|email|max:255',
                'profile.email_verified' => 'required|boolean',
            ];

            $validator = Validator::make($request->all(), $valRules);

            if ($validator->fails()) {
                return response()->json([
                    'message' => $validator->errors()->first(),
                ], 400); // bad request
            }

            // TODO
            // check if the email already exists
            // if doesn't exist, create user, allow sign in
            // if exists check if the user has a password, if yes(means it's registered using cred provider) don't allow google sign-in,
            // if no pass then also check for provider if it's google, if yes allow otherwise don't.
            // conclusion - different provider isn't allowed to be linked

            $user = User::where('email', $request->input('profile.email'))->first();

            if (!$user) {
                // create a new user and account,
                DB::beginTransaction();

                $newUser = User::create([
                    'user_type' => 'registered',
                    'firstname' => $request->input('profile.firstname'),
                    'lastname' => $request->input('profile.lastname'),
                    'email' => $request->input('profile.email'),
                    'email_verified_at' => filter_var($request->input('profile.email_verified'), FILTER_VALIDATE_BOOLEAN) ? now() : null,
                ]);

                Account::create([
                    'userId' => $newUser->uuid,
                    'type' => $request->input('account.type'),
                    'provider' => $request->input('account.provider'),
                    'providerAccountId' => $request->input('account.providerAccountId'),
                    'access_token' => $request->input('account.access_token'),
                    'refresh_token' => $request->input('account.refresh_token'),
                    'expires_at' => $request->input('account.expires_at'),
                    'token_type' => $request->input('account.token_type'),
                    'scope' => $request->input('account.scope'),
                    'id_token' => $request->input('account.id_token'),
                ]);

                DB::commit();

                return response()->json([
                    "isAllowedtoSignin" => true,
                    "userdata" => new UserResource($newUser),
                    "message" => "OAuth sign-in successful",
                ], 201);
            }

            if ($user->password) {
                // email registered with Credentials provider as OAuth doesn't use password
                return response()->json([
                    "isAllowedtoSignin" => false,
                    "userdata" => null,
                    "message" => "OAuth sign-in denied for provider",
                ], 200);
            }

            // check for provider
            $userAccProvider = $user->accounts->first()?->provider; // first() because only 1 account/user is allowed at most currently

            if ($userAccProvider && ($userAccProvider !== $request->input('account.provider'))) {
                // user registered with one OAuth provider and trying to sign-in with another
                return response()->json([
                    "isAllowedtoSignin" => false,
                    "userdata" => null,
                    "message" => "OAuth sign-in denied for provider",
                ], 200);
            }

            // update account record
            $accChangingData = [
                'providerAccountId' => $request->input('account.providerAccountId'),
                'access_token' => $request->input('account.access_token'),
                'refresh_token' => $request->input('account.refresh_token'),
                'expires_at' => $request->input('account.expires_at'),
                'token_type' => $request->input('account.token_type'),
                'scope' => $request->input('account.scope'),
                'id_token' => $request->input('account.id_token'),
            ];

            $account = Account::where('userId', $user->uuid)
            ->where('provider', $request->input('account.provider'))
            ->first();

            if ($account) {
                // update only the changing fields
                $account->update($accChangingData);
            } else {
                // insert a new account record
                Account::create(array_merge($accChangingData, [
                    'userId' => $user->uuid,
                    'type' => $request->input('account.type'),
                    'provider' => $request->input('account.provider'),
                ]));
            }

            return response()->json([
                "isAllowedtoSignin" => true,
                "userdata" => new UserResource($user),
                "message" => "OAuth sign-in successful",
            ], 200);
            // try end
        } catch (\Exception $e) {
            DB::rollBack();
            // Logging the exception for debugging
            Log::error('Error signing in with OAuth: ' . $e->getMessage());

            return response()->json(['message' => 'An error occurred while signing in with OAuth'], 500);
        }
    }
}
