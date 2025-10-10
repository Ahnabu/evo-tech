<?php

namespace App\Traits;

use Illuminate\Support\Str;


trait HasUuidCustom
{
    protected static function bootHasUuidCustom()
    {
        static::creating(function ($model) {
            if (empty($model->uuid)) {
                $model->uuid = (string) Str::orderedUuid();
            }
        });
    }
}
