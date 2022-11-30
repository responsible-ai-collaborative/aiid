const config = require('../config');

/**
 *
 * @param {{context: {client: import('mongodb').MongoClient}}} context
 */

exports.up = async ({ context: { client } }) => {
  const collection = client.db(config.realm.production_db.db_name).collection('reports');

  await collection.updateOne(
    { report_number: 50 },
    {
      $set: {
        image_url:
          'https://o.aolcdn.com/hss/storage/midas/b079b00ad5d865efdbf8eeacbe6f4f8e/205801557/GoogleNLP_API.JPG.cf.webp',
        cloudinary_id:
          'reports/o.aolcdn.com/hss/storage/midas/b079b00ad5d865efdbf8eeacbe6f4f8e/205801557/GoogleNLP_API.JPG.cf.webp',
      },
    }
  );

  await collection.updateOne(
    { report_number: 113 },
    {
      $set: {
        image_url:
          'https://o.aolcdn.com/hss/storage/midas/8293875fc7657b84f13caae124bcff24/206357753/Gmail-ai-compose-phrases-2018-05-08-03.jpg.cf.webp',
        cloudinary_id:
          'reports/o.aolcdn.com/hss/storage/midas/8293875fc7657b84f13caae124bcff24/206357753/Gmail-ai-compose-phrases-2018-05-08-03.jpg.cf.webp',
      },
    }
  );

  await collection.updateOne(
    { report_number: 253 },
    {
      $set: {
        image_url:
          'https://o.aolcdn.com/hss/storage/midas/dd0c6223440cab40be502e71d89810c7/205846255/self-driving-crash.jpg.cf.webp',
        cloudinary_id:
          'reports/o.aolcdn.com/hss/storage/midas/dd0c6223440cab40be502e71d89810c7/205846255/self-driving-crash.jpg.cf.webp',
      },
    }
  );

  await collection.updateOne(
    { report_number: 411 },
    {
      $set: {
        image_url:
          'https://www.blogcdn.com/www.dailyfinance.com/media/2009/04/declineandspout200cs1013.jpg',
        cloudinary_id:
          'reports/www.blogcdn.com/www.dailyfinance.com/media/2009/04/declineandspout200cs1013.jpg',
      },
    }
  );

  await collection.updateOne(
    { report_number: 445 },
    {
      $set: {
        image_url:
          'https://o.aolcdn.com/hss/storage/midas/d5d78a1dfea57f738b2889a50b80ffd0/206295605/0228-tesla-model3-9322-1.jpg.cf.webp',
        cloudinary_id:
          'reports/o.aolcdn.com/hss/storage/midas/d5d78a1dfea57f738b2889a50b80ffd0/206295605/0228-tesla-model3-9322-1.jpg.cf.webp',
      },
    }
  );

  await collection.updateOne(
    { report_number: 574 },
    {
      $set: {
        image_url: 'https://miro.medium.com/max/1400/1*KB8FQGj9EreUFCTILcHXdA.webp',
        cloudinary_id: 'reports/miro.medium.com/max/1400/1*KB8FQGj9EreUFCTILcHXdA.webp',
      },
    }
  );

  await collection.updateOne(
    { report_number: 687 },
    {
      $set: {
        image_url:
          'https://o.aolcdn.com/hss/storage/midas/de8a83955cb99d23cff238e5109979b6/205465657/Obama+photos.jpg.cf.webp',
        cloudinary_id:
          'reports/o.aolcdn.com/hss/storage/midas/de8a83955cb99d23cff238e5109979b6/205465657/Obama+photos.jpg.cf.webp',
      },
    }
  );

  await collection.updateOne(
    { report_number: 1213 },
    {
      $set: {
        image_url:
          'https://o.aolcdn.com/hss/storage/midas/33e8a404fae0a0759c31a01f6dba1088/205484599/DE9Y1vtU0AAAjHx.jpg.cf.webp',
        cloudinary_id:
          'reports/o.aolcdn.com/hss/storage/midas/33e8a404fae0a0759c31a01f6dba1088/205484599/DE9Y1vtU0AAAjHx.jpg.cf.webp',
      },
    }
  );

  await collection.updateOne(
    { report_number: 1265 },
    {
      $set: {
        image_url:
          'https://o.aolcdn.com/hss/storage/midas/758b44b3c1b1dd706c74b19266f780a6/204374516/google-self-driving-car-intersection-accident-ed.jpg.cf.webp',
        cloudinary_id:
          'reports/o.aolcdn.com/hss/storage/midas/758b44b3c1b1dd706c74b19266f780a6/204374516/google-self-driving-car-intersection-accident-ed.jpg.cf.webp',
      },
    }
  );
};
