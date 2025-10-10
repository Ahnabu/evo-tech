<?php

namespace App\Traits;

use Illuminate\Support\Str;


trait HasUuidOrder
{
    protected static function bootHasUuidOrder()
    {
        static::creating(function ($model) {
            if (empty($model->order_key)) {
                $model->order_key = (string) Str::orderedUuid();
            }
        });
    }
}
