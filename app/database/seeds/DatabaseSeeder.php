<?php

class DatabaseSeeder extends Seeder {

  public function run()
  {
    $this->call('RoosterTableSeeder');
    $this->command->info('Rooster table seeded!');
  }
}

class RoosterTableSeeder extends Seeder {

    // Vul de rooster tabel met echte data
    public function run()
    {
      // Eerst de oude roosterdata verwijderen
      RoosterFetch::deleteOud();

      // JSON ophalen waarin alle klassen staan die gedownload moeten worden.
      $klas_whitelist_bestand = file_get_contents(public_path().'/klaswhitelist.json');
      $klas_whitelist = json_decode($klas_whitelist_bestand, true);

      foreach ($klas_whitelist as $klas) {
        RoosterFetch::getFile($klas);
      }
    }

}
