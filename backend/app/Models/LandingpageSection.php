<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LandingpageSection extends Model
{
    /** @use HasFactory<\Database\Factories\LandingpageSectionFactory> */
    use HasFactory;

    protected $table = 'landingpage_sections';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'section_title',
        'view_more_url',
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
        ];
    }

    
    public function items()
    {
        return $this->hasMany(Item::class, 'landingpage_section_id', 'id')->orderBy('landingpage_sortorder', 'asc');
    }
}
