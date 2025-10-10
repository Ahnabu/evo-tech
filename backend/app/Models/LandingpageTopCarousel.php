<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LandingpageTopCarousel extends Model
{
    
    protected $table = 'landingpage_top_carousel';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'title',
        'subtitle',
        'more_text',
        'button_text',
        'button_url',
        'imgurl',
        'sortorder',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array<string, string>
     */
    protected function casts(): array
    {
        return [
            'sortorder' => 'integer',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

}
