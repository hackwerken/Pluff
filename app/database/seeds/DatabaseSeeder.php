<?php

class DatabaseSeeder extends Seeder {

  public function run()
  {
    $this->call('RoosterTableSeeder');
  }
}

class RoosterTableSeeder extends Seeder {

    // Vul de rooster tabel met echte data
    public function run()
    {
      $startTijd = microtime(1);

      echo "\nDATUM: ".Carbon::now()->toDateTimeString()."\n";
      // Eerst de oude roosterdata verwijderen
      RoosterFetch::deleteOud();

      // Cache leegmaken
      Cache::flush();

      // JSON ophalen waarin alle klassen staan die gedownload moeten worden.
      $klas_whitelist_bestand = file_get_contents(public_path().'/klaswhitelist.json');
      $klas_whitelist = json_decode($klas_whitelist_bestand, true);

      foreach ($klas_whitelist as $klas) {
        RoosterFetch::deleteHuidig($klas);
        RoosterFetch::getFile($klas);
      }

      // Simpele benchmark
      $eindTijd = microtime(1);
      $tijdsDuur = round($eindTijd - $startTijd, 1);

      $this->command->info('Klaar met seeden. '.Rooster::count().' rijen in tabel. Duur: '.$tijdsDuur.'s');
    }

}
