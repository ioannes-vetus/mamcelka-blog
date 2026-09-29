import React from 'react';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Avatar from '@site/src/components/Avatar';
import styles from './index.module.css';

export default function Home(): React.ReactElement {
  const {siteConfig} = useDocusaurusContext();

  return (
    <Layout title={siteConfig.title} description={siteConfig.tagline}>
      <main className={styles.main}>
        <div className={styles.content} data-search-content>
          <Avatar
            src="/img/me.JPG"
            name="Natália Stará"
            role="Manželka, mama, učiteľka"
            instagramUrl="https://www.instagram.com/_nataliastara_/"
            email="stranakovan01@gmail.com"
          />

          <h1>Ahojte a vitajte!</h1>
          <p>
            V prvom rade vás chcem srdečne privítať na mojom blogu. Rada by som
            tu vytvorila miesto plné inšpirácie, pokojného čítania a myšlienok,
            ktoré možno pohladia dušu, prinútia zamyslieť sa alebo vás na chvíľu
            zastavia v každodennom zhone.
          </p>

          <p>
            V prvom rade som manželka môjho milovaného muža, ktorý ma každý deň
            podporuje, inšpiruje a stojí pri mne aj pri týchto mojich
            „bláznivých“ nápadoch. Som mama mojich milovaných dievčat, Kláry a
            Sáry. Sú to moje vysnívané, vymodlené dievčatá a ja si s nimi naplno
            užívam každý jeden deň. Milujem náš dievčenský svet, ktorý si spolu
            tvoríme. Učím ich pozerať sa na svet s láskou, s láskavým srdcom a
            veľmi túžim, aby z nich vyrástli silné ženy – také, ktoré si veria,
            majú zdravé sebavedomie, no zároveň sa neboja požiadať o pomoc.
            Ženy, ktoré budú samy pre seba dosť.
          </p>

          <p>
            Som pani učiteľka v materskej škole a moje srdce pre toto povolanie
            horí už od detstva. Zapálila ho vo mne moja milovaná babinka. Dnes
            cítim veľkú pokoru aj zodpovednosť toto povolanie vykonávať s
            hrdosťou, láskou a úctou. Verím, že je len málo profesií, ktoré majú
            taký silný dopad na spoločnosť ako práve učiteľ – ten, ktorý
            formuje, vedie a pomáha budovať budúce generácie.
          </p>

          <p>
            A v neposlednom rade som veriaci človek. Verím, že aj touto cestou
            ma Pán Boh niekam vedie. Som vďačná za dar písania, ktorý som
            dostala, a za možnosť zdieľať svoje myšlienky práve s vami.
          </p>

          <p>
            Ak vás aspoň jedna veta z mojich článkov inšpiruje, pohladí alebo
            vám vyčarí úsmev na tvári, má to pre mňa zmysel.
          </p>

          <p>
            Tak si každú nedeľu večer zapáľte sviečku, zapnite svetielka, urobte
            si čaj alebo sa zabaľte do deky. Urobte čokoľvek, pri čom sa cítite
            príjemne… a začítajte sa. Moje články budú venované témam
            rodičovstva, výchovy a vzdelávania – tak, ako ich žijem ja, nielen
            ako učiteľka, ale najmä ako mama.
          </p>
        </div>
      </main>
    </Layout>
  );
}
