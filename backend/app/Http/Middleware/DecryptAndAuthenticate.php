<?php

namespace App\Http\Middleware;

use Closure;
use Exception;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;


class DecryptAndAuthenticate
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {

        // $jwtSecret = env('JWT_SECRET');
        // // $binJwtSecret = hex2bin($jwtSecret);

        // $jwk = JWKFactory::createFromSecret($jwtSecret);

        // // $jwk = new JWK([
        // //     'kty' => 'oct',
        // //     'k'   => Base64UrlSafe::encode($binJwtSecret),
        // // ]);

        // // Set up the algorithm managers for key and content encryption.
        // $keyEncAlgManager = new AlgorithmManager([
        //     new DirEncryption(),
        // ]);

        // $contentEncAlgManager = new AlgorithmManager([
        //     new A256CBCHS512(), // not working, need to find out
        // ]);

        // $compressionAlgorithms = new AlgorithmManager([]);

        // $decrypter = new JWEDecrypter($keyEncAlgManager, $contentEncAlgManager, $compressionAlgorithms); // Instantiate the JWE decrypter.

        // $serializer = new CompactSerializer(); // Compact Serializer to unserialize the token.

        // Retrieve your token from the cookie
        // if (!$request->hasCookie('authjs_session-token')) {
        //     return response()->json([
        //         'message' => 'unauthorized, cookie not found',
        //     ], 401);
        // }

        // $encryptedToken = $request->cookie('authjs_session-token');

        // $jwe = $serializer->unserialize($encryptedToken); // Unserialize the compact JWE token.

        // // decrypt the token
        // if (!$decrypter->decryptUsingKey($jwe, $jwk, 0)) {
        //     return response()->json([
        //         'message' => 'Failed to verify token',
        //     ], 401);
        // }

        // // If decryption was successful
        // $payload = $jwe->getPayload();

        // // JSON payload into an array of claims.
        // $claims = json_decode($payload, true);

        // Log::info('JWE: ' . $jwe . 'Claims: ' . $claims);

        // return response()->json([
        //     'jwe' => $jwe,
        //     'claims' => $claims,
        //     'message' => 'verified JWT response',
        // ], 200);

        $authorizationHeader = $request->header('Authorization');

        if (!$authorizationHeader || !preg_match('/Bearer\s(\S+)/', $authorizationHeader, $matches)) {
            return response()->json(['message' => 'Token not provided'], Response::HTTP_UNAUTHORIZED);
        }

        $token = $matches[1];

        try {
            // Verify the token using the same secret and HS256 algorithm.
            $decoded = JWT::decode($token, new Key(env('JWT_SECRET'), 'HS256'));
            // Attach the decoded token (payload) to the request, if needed.
            $request->attributes->add(['jwt_payload' => (array) $decoded]);

            return response()->json(['jwt_payload' => (array) $decoded], 200);
        } catch (Exception $e) {
            return response()->json(['error' => 'oops! invalid token: ' . $e->getMessage()], Response::HTTP_UNAUTHORIZED);
        }

        // return $next($request);
    }

}
