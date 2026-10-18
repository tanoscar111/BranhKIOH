import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Layout from 'components/Layout';
import styles from './Project5.module.sass';
import Header from 'components/Header';
import HeaderProject from 'components/HeaderProject';
import LinkNextProject from 'components/LinkNextProject';
import Credits from 'components/Credits';
import ModalImage, { ModalImageItem } from 'components/ModalImage';

const projectImages: ModalImageItem[] = [
  {
    src: 'images/kleidi/kleidi-ethan-piboyeux.jpg',
    alt: "Kleidi est un dispositif visant à rendre accessible l'art aux personnes en situation de handicap visuel à travers une expérience innovante, sensorielle et auditive via le biais d'impressions de plaques tactiles et d'audioguides.",
  },
];

const Project5 = (): JSX.Element => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [modalIndex, setModalIndex] = useState<number>(0);
  const [displayModal, setDisplayModal] = useState<boolean>(false);

  const handleOpenModal = (index: number) => {
    setModalIndex(index);
    setDisplayModal(true);
  };

  return (
    <Layout>
      <Helmet>
        <title>THANH TÂN | Kleidi</title>
        <meta
          name="description"
          content="Kleidi est un dispositif visant à rendre accessible l'art aux personnes en situation de handicap visuel à travers une expérience innovante, sensorielle et auditive via le biais d'impressions de plaques tactiles et d'audioguides."
        />
      </Helmet>

      <ModalImage
        images={projectImages}
        initialIndex={modalIndex}
        display={displayModal}
        autoPlay={true}
        autoPlayInterval={3500}
        onClose={() => setDisplayModal(false)}
      />

      <Header url="/kleidi" />
      <div className={styles.container}>
        <HeaderProject
          title="Kleidi"
          index={5}
          titleLink="Découvrir le projet"
          link="https://kleidi.org/"
          year={2021}
          services={['Chef de projet']}
        />

        <p className={`${styles.text__introduction} ${styles.animation__transform_top}`}>
          Kleidi est un dispositif visant à rendre accessible l'art aux personnes en situation de
          handicap visuel à travers une expérience innovante, sensorielle et auditive via le biais
          d'impressions de plaques tactiles et d'audioguides.
        </p>

        <div className={styles.images__container}>
          <div className={`${styles.row} ${styles.animation__transform_top}`}>
            <img
              src={projectImages[0].src}
              alt={projectImages[0].alt}
              onClick={() => handleOpenModal(0)}
            />
            <video
              controls
              controlsList="nodownload"
              poster="images/kleidi/kleidi-ethan-piboyeux-miniature-1.jpg"
            >
              <source src="images/kleidi/kleidi-plaque-ethan-piboyeux.mp4" type="video/mp4" />
            </video>
          </div>
          <video
            className={styles.animation__transform_top}
            controls
            controlsList="nodownload"
            poster="images/kleidi/kleidi-ethan-piboyeux-miniature-2.jpg"
          >
            <source src="images/kleidi/kleidi-inauguration-ethan-piboyeux.mp4" type="video/mp4" />
          </video>
        </div>

        <div className={styles.footer__project}>
          <div>
            <Credits
              credits={[
                {
                  name: 'Enzo Arnaudet',
                  role: 'Développeur web',
                },
                {
                  name: 'Mathieu Delepine',
                  role: 'Développeur web, Rédaction, 3D',
                },
                {
                  name: 'Tristan Guillemot',
                  role: 'Communication',
                },
                {
                  name: 'Mael Aurensan',
                  role: 'Communication, Presse, Partenaires',
                },
                {
                  name: 'Marc Lacault',
                  role: 'Rédaction, Sound design',
                },
                {
                  name: 'Théo Guiraud',
                  role: 'Design 3D',
                },
              ]}
            />

            <div className={styles.animation__background}>
              <LinkNextProject text="9 MILLI" link="/9-milli" />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Project5;
