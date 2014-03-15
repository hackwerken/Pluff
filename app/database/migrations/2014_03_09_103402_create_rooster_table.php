<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateRoosterTable extends Migration {

  public function up()
  {
    Schema::create('rooster', function(Blueprint $table) {
      $table->increments('id');
      $table->datetime('tijdstip_begin');
      $table->datetime('tijdstip_eind');
      $table->integer('uurnr_begin');
      $table->integer('uurnr_eind');
      $table->string('vak', 255)->nullable();
      $table->string('klas', 255)->nullable();
      $table->string('lokaal', 255)->nullable();
      $table->string('docent', 255)->nullable();
      $table->timestamps();
    });
  }

  public function down()
  {
    Schema::drop('rooster');
  }
}
