const config = require('../config');

/** @type {import('umzug').MigrationFn<any>} */
exports.up = async ({ context: { client } }) => {
  await client.connect();

  const publicationsCollection = await client
    .db(config.realm.production_db.db_name)
    .createCollection('publications');

  for (const publication of publications) {
    publicationsCollection.insertOne(publication);
  }
};

/** @type {import('umzug').MigrationFn<any>} */
exports.down = async ({ context: { client } }) => {
  await client.connect();

  await client.db(config.realm.production_db.db_name).dropCollection('publications');
};

// From src/scripts/getMediaBiasFactCheckLabels.js
const publications = [
  {
    title: 'Act.TV',
    domain: 'act.tv',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Action Network',
    domain: 'actionnetwork.org',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Alaska Beacon',
    domain: 'alaskabeacon.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Alliance for Justice (AFJ)',
    domain: 'afj.org',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Alternet',
    domain: 'alternet.org',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Amandla',
    domain: 'aidc.org.za',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'America Blog',
    domain: 'americablog.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'American Bridge 21st Century',
    domain: 'americanbridgepac.org',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Americans United for Separation of Church and State',
    domain: 'au.org',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Angry White Men',
    domain: 'angrywhitemen.org',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Arizona Mirror',
    domain: 'azmirror.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Arkansas Advocate',
    domain: 'arkansasadvocate.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Attack the System',
    domain: 'attackthesystem.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'AT Advocacy',
    domain: 'atadvocacy.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'AutoStraddle',
    domain: 'autostraddle.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Baltimore City Paper',
    domain: 'citypaper.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Bay Area Reporter',
    domain: 'ebar.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Being Liberal',
    domain: 'themaven.net',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'BillMoyers.com',
    domain: 'billmoyers.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Bitch Media',
    domain: 'bitchmedia.org',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Black Agenda Report',
    domain: 'blackagendareport.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Black America Web',
    domain: 'blackamericaweb.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Black Lives Matter',
    domain: 'blacklivesmatter.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Black Main Street',
    domain: 'blackmainstreet.net',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Black News Channel (BNC)',
    domain: 'bnc.tv',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'BoingBoing',
    domain: 'boingboing.net',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Bolde',
    domain: 'bolde.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Boston Review',
    domain: 'bostonreview.net',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Briarpatch Magazine',
    domain: 'briarpatchmagazine.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Brit + Co',
    domain: 'brit.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'B’Tselem',
    domain: 'btselem.org',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Bust Magazine',
    domain: 'bust.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Call to Activism',
    domain: 'calltoactivism.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Canada Fact Check',
    domain: 'canadafactcheck.ca',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Canadian Anti-Hate Network',
    domain: 'antihate.ca',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Canadian Dimension',
    domain: 'canadiandimension.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Capital & Main',
    domain: 'capitalandmain.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Care2',
    domain: 'care2.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Ceasefire Magazine',
    domain: 'ceasefiremagazine.co.uk',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Center for American Progress',
    domain: 'americanprogress.org',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Center for Biological Diversity',
    domain: 'biologicaldiversity.org',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Center for Law and Social Policy',
    domain: 'clasp.org',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Center for Media and Democracy',
    domain: 'prwatch.org',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Center for a Stateless Society',
    domain: 'c4ss.org',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Chicago Reader',
    domain: 'chicagoreader.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Chicago Reporter',
    domain: 'chicagoreporter.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'China Internet Information Center',
    domain: 'china.org.cn',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Cincinnati CityBeat',
    domain: 'citybeat.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Citizen Critics',
    domain: 'citizencritics.org',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Cleveland Scene',
    domain: 'clevescene.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Climate Home News',
    domain: 'climatechangenews.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'CNN',
    domain: 'cnn.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Coda Story',
    domain: 'codastory.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Code Pink',
    domain: 'codepink.org',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Colorado Newsline',
    domain: 'coloradonewsline.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Colorado Times Reporter',
    domain: 'coloradotimesreporter.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'ColorLines',
    domain: 'colorlines.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Color of Change',
    domain: 'colorofchange.org',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Common Dreams',
    domain: 'commondreams.org',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Commune Magazine',
    domain: 'communemag.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Communist Party USA',
    domain: 'cpusa.org',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Consortium News',
    domain: 'consortiumnews.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Cop Block',
    domain: 'copblock.org',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Cosmopolitan',
    domain: 'cosmopolitan.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'CounterCurrents.org',
    domain: 'countercurrents.org',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Counterfire',
    domain: 'counterfire.org',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'CounterPunch',
    domain: 'counterpunch.org',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Crikey',
    domain: 'crikey.com.au',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'CrimethInc',
    domain: 'crimethinc.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Crooked Media',
    domain: 'crooked.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Crooks and Liars',
    domain: 'crooksandliars.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Current Affairs',
    domain: 'currentaffairs.org',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Curve Magazine',
    domain: 'curvemag.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Daily Beast',
    domain: 'thedailybeast.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Daily Dot',
    domain: 'dailydot.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Daily Montanan',
    domain: 'dailymontanan.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Daily Record (Scotland)',
    domain: 'dailyrecord.co.uk',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Daily Sound and Fury',
    domain: 'dailysoundandfury.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Dallas Voice',
    domain: 'dallasvoice.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Dame Magazine',
    domain: 'damemagazine.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'DeadState',
    domain: 'deadstate.org',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Deadspin',
    domain: 'deadspin.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Defend Democracy Press',
    domain: 'defenddemocracy.press',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Democracy Chronicles',
    domain: 'democracychronicles.org',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Democracy Journal',
    domain: 'democracyjournal.org',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Democracy Now',
    domain: 'democracynow.org',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Democratic Underground',
    domain: 'democraticunderground.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'DeSmog',
    domain: 'desmogblog.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Dissent Magazine',
    domain: 'dissentmagazine.org',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Drudge Retort',
    domain: 'drudge.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Earth First Journal',
    domain: 'earthfirstjournal.org',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Ecowatch',
    domain: 'ecowatch.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Egberto Willies',
    domain: 'egbertowillies.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Electoral-Vote.com',
    domain: 'electoral-vote.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Electronic Intifada',
    domain: 'electronicintifada.net',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Elite Daily',
    domain: 'elitedaily.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Elle Magazine',
    domain: 'elle.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Erin in the Morning',
    domain: 'erininthemorning.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Esquire Magazine',
    domain: 'esquire.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Everyday Feminism',
    domain: 'everydayfeminism.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Evonomics',
    domain: 'evonomics.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'FairPlanet',
    domain: 'fairplanet.org',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Feminist Current',
    domain: 'feministcurrent.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Fifth Estate',
    domain: 'fifthestate.org',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Finnish News',
    domain: 'finnishnews.fi',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Florida Phoenix',
    domain: 'floridaphoenix.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Food and Water Watch',
    domain: 'foodandwaterwatch.org',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Foreign Policy Journal',
    domain: 'foreignpolicyjournal.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Foreign Policy News',
    domain: 'foreignpolicynews.org',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Free Press',
    domain: 'freepress.org',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Freedom From Religion Foundation',
    domain: 'ffrf.org',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Freedom News and Journal',
    domain: 'freedomnews.org.uk',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Front Page Live',
    domain: 'frontpagelive.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'FSTv (Freespeech.org)',
    domain: 'freespeech.org',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Gawker',
    domain: 'gawker.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Gay City News',
    domain: 'gaycitynews.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Gay Star News',
    domain: 'gaystarnews.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Gay Times',
    domain: 'gaytimes.co.uk',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Geopolitics Alert',
    domain: 'geopoliticsalert.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Georgia Recorder',
    domain: 'georgiarecorder.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Giffords Law Center to Prevent Gun Violence',
    domain: 'giffords.org',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Gizmodo',
    domain: 'gizmodo.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'GLAAD',
    domain: 'glaad.org',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Global Voices',
    domain: 'globalvoices.org',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Good Magazine',
    domain: 'good.is',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'GQ Magazine',
    domain: 'gq.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Grasping Reality With Both Hands: Bradford Delong',
    domain: 'bradford-delong.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Green Left Weekly',
    domain: 'greenleft.org.au',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Guardian Liberty Voice',
    domain: 'guardianlv.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Haaretz',
    domain: 'haaretz.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Harper’s Bazaar',
    domain: 'harpersbazaar.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Harvard International Review',
    domain: 'hir.harvard.edu',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'High Times',
    domain: 'hightimes.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Hill Reporter',
    domain: 'hillreporter.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Huffington Post',
    domain: 'huffingtonpost.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Human Rights Campaign',
    domain: 'hrc.org',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Idaho Capital Sun',
    domain: 'idahocapitalsun.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'In Defence of Marxism',
    domain: 'marxist.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'In These Times',
    domain: 'inthesetimes.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Independent Florida Alligator',
    domain: 'alligator.org',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Indivisible Movement',
    domain: 'indivisible.org',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Inequality Media',
    domain: 'inequalitymedia.org',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Informed Comment (Juan Cole)',
    domain: 'juancole.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Institute for Policy Studies',
    domain: 'ips-dc.org',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'International Policy Institute',
    domain: 'intpolicydigest.org',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'International Viewpoint',
    domain: 'internationalviewpoint.org',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Intrepid Report',
    domain: 'intrepidreport.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Iowa Capital Dispatch',
    domain: 'iowacapitaldispatch.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Iowa Starting Line',
    domain: 'iowastartingline.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'It’s Going Down',
    domain: 'itsgoingdown.org',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Jacobin',
    domain: 'jacobinmag.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Jezebel',
    domain: 'jezebel.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Junkee',
    domain: 'junkee.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Kansas Reflector',
    domain: 'kansasreflector.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Knock-LA',
    domain: 'knock-la.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Lavender Magazine',
    domain: 'lavendermagazine.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'LA Weekly',
    domain: 'laweekly.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Left Foot Forward',
    domain: 'leftfootforward.org',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Left Voice',
    domain: 'leftvoice.org',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Le Monde Diplomatique',
    domain: 'monde-diplomatique.fr',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'LEO Weekly – Louisville',
    domain: 'leoweekly.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'LGBTQ Nation',
    domain: 'lgbtqnation.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Libcom.org',
    domain: 'libcom.org',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Liberal America',
    domain: 'liberalamerica.life',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Liberation News',
    domain: 'liberationnews.org',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Little Green Footballs',
    domain: 'littlegreenfootballs.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Louisiana Illuminator',
    domain: 'lailluminator.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Mail & Guardian',
    domain: 'mg.co.za',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Maine Beacon',
    domain: 'mainebeacon.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Mashable',
    domain: 'mashable.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Media Matters',
    domain: 'mediamatters.org',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Mediaite',
    domain: 'mediaite.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Meduza',
    domain: 'meduza.io',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'MeidasTouch',
    domain: 'meidastouch.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Merry Jane',
    domain: 'merryjane.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Miami New Times',
    domain: 'miaminewtimes.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Michigan Advance',
    domain: 'michiganadvance.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Middle East Monitor',
    domain: 'middleeastmonitor.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Middletown Media',
    domain: 'muncievoice.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Milwaukee Independent',
    domain: 'milwaukeeindependent.org',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Minnesota Reformer',
    domain: 'minnesotareformer.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Missouri Independent',
    domain: 'missouriindependent.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Modern Liberals',
    domain: 'modernliberals.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Monthly Review',
    domain: 'monthlyreview.org',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Ms. (Magazine)',
    domain: 'msmagazine.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'MSNBC',
    domain: 'msnbc.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Nation of Change',
    domain: 'nationofchange.org',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'National Association for the Advancement of Colored People (NAACP)',
    domain: 'naacp.org',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Natural Resources Defense Council',
    domain: 'nrdc.org',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'NC Policy Watch',
    domain: 'ncpolicywatch.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Nebraska Examiner',
    domain: 'nebraskaexaminer.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Nevada Current',
    domain: 'nevadacurrent.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'New Internationalist',
    domain: 'newint.org',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'New Jersey Monitor',
    domain: 'newjerseymonitor.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'New Politics Magazine',
    domain: 'newpol.org',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'New Republic',
    domain: 'newrepublic.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'New Statesman',
    domain: 'newstatesman.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'New York Amsterdam News',
    domain: 'amsterdamnews.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'New York Magazine',
    domain: 'nymag.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'New Yorker',
    domain: 'newyorker.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'News Corpse',
    domain: 'newscorpse.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'News Hounds',
    domain: 'newshounds.us',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'NewsOne',
    domain: 'newsone.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Novara Media',
    domain: 'novaramedia.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Now Magazine',
    domain: 'nowtoronto.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Occupy.com',
    domain: 'occupy.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Ohio Capital-Journal',
    domain: 'ohiocapitaljournal.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'One Green Planet',
    domain: 'onegreenplanet.org',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'OpEdNews (OEN)',
    domain: 'opednews.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Open Society Foundations',
    domain: 'opensocietyfoundations.org',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Oregon Capital Chronicle',
    domain: 'oregoncapitalchronicle.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Orlando Weekly',
    domain: 'orlandoweekly.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Out Magazine',
    domain: 'out.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Palmer Report',
    domain: 'palmerreport.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Paste Magazine',
    domain: 'pastemagazine.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Pennsylvania Capital-Star',
    domain: 'penncapital-star.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'People for the American Way (PFAW)',
    domain: 'pfaw.org',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'People Magazine',
    domain: 'people.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'People’s Policy Project',
    domain: 'peoplespolicyproject.org',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'People’s World',
    domain: 'peoplesworld.org',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'PINAC',
    domain: 'photographyisnotacrime.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Pink News',
    domain: 'pinknews.co.uk',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Political Tribune',
    domain: 'politicaltribune.org',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'PoliticusUsa',
    domain: 'politicususa.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Politizoom',
    domain: 'politizoom.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Popular Information',
    domain: 'popular.info',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Popular Resistance',
    domain: 'popularresistance.org',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Post Carbon Institute',
    domain: 'postcarbon.org',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Press Progress',
    domain: 'pressprogress.ca',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Progressive Change Campaign Committee',
    domain: 'boldprogressives.org',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Project Censored',
    domain: 'projectcensored.org',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Psyche',
    domain: 'psyche.co',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Queerty',
    domain: 'queerty.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Rabble.ca',
    domain: 'rabble.ca',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Raw Story',
    domain: 'rawstory.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Reader Supported News (RSN)',
    domain: 'readersupportednews.org',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Reading the Pictures',
    domain: 'readingthepictures.org',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Real News Network',
    domain: 'therealnews.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Red Pepper',
    domain: 'redpepper.org.uk',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Refinery29',
    domain: 'refinery29.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Republic Report',
    domain: 'republicreport.org',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Resilience (Post Carbon Institute)',
    domain: 'resilience.org',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Resolute Square',
    domain: 'resolutesquare.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Revcom.us',
    domain: 'revcom.us',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'ReWire.news',
    domain: 'rewire.news',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Right Wing Watch',
    domain: 'rightwingwatch.org',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Ring of Fire',
    domain: 'trofire.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Rolling Stone',
    domain: 'rollingstone.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Salon',
    domain: 'salon.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'San Antonio Current',
    domain: 'sacurrent.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'San Francisco Bay View',
    domain: 'sfbayview.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Scary Mommy',
    domain: 'scarymommy.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Second Nexus',
    domain: 'secondnexus.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Shadow Proof',
    domain: 'shadowproof.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Shondaland',
    domain: 'shondaland.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Slate',
    domain: 'slate.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Sludge',
    domain: 'readsludge.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Socialist Standard',
    domain: 'worldsocialism.org',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'SocialistWorker.org',
    domain: 'socialistworker.org',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Source New Mexico',
    domain: 'sourcenm.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'SourceWatch',
    domain: 'sourcewatch.org',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'South Dakota Searchlight',
    domain: 'southdakotasearchlight.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Southern Poverty Law Center',
    domain: 'splcenter.org',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'St. Louis Riverfront Times',
    domain: 'riverfronttimes.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'St. Pete for Peace',
    domain: 'stpete4peace.org',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Talking Points Memo',
    domain: 'talkingpointsmemo.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Teen Vogue',
    domain: 'teenvogue.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Tennessee Holler',
    domain: 'tnholler.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Tennessee Lookout',
    domain: 'tennesseelookout.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The 19th News',
    domain: '19thnews.org',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Advocate',
    domain: 'advocate.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The American Independent Institute',
    domain: 'americanindependent.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The American Prospect',
    domain: 'prospect.org',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Austin Chronicle',
    domain: 'austinchronicle.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Baffler',
    domain: 'thebaffler.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Burning Spear',
    domain: 'theburningspear.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Canary (UK)',
    domain: 'thecanary.co',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Climate Reality Project',
    domain: 'climaterealityproject.org',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Cut',
    domain: 'thecut.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Daily 49er',
    domain: 'daily49er.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Daily Banter',
    domain: 'thedailybanter.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Daily Buzz',
    domain: 'the-daily.buzz',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Daily Vox',
    domain: 'thedailyvox.co.za',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Democratic Hub',
    domain: 'democratichub.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Dworkin Report',
    domain: 'dworkinreport.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Florida Squeeze',
    domain: 'thefloridasqueeze.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Gaily Grind',
    domain: 'thegailygrind.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Gay Center',
    domain: 'gaycenter.org',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Ghion Journal',
    domain: 'ghionjournal.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Good Men Project',
    domain: 'goodmenproject.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Gravel Institute',
    domain: 'gravelinstitute.org',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Indypendent',
    domain: 'indypendent.org',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Intellectualist',
    domain: 'theintellectualist.co',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Lever',
    domain: 'levernews.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Lily',
    domain: 'thelily.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The London Economic',
    domain: 'thelondoneconomic.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Maple',
    domain: 'readthemaple.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Mary Sue',
    domain: 'themarysue.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Militant',
    domain: 'themilitant.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Monthly (Australia)',
    domain: 'themonthly.com.au',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Morning Star',
    domain: 'morningstaronline.co.uk',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Narwhal',
    domain: 'thenarwhal.ca',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The National Memo',
    domain: 'nationalmemo.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The New Civil Rights Movement',
    domain: 'thenewcivilrightsmovement.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Palestine Chronicle',
    domain: 'palestinechronicle.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Phnom Penh Post',
    domain: 'phnompenhpost.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Progressive',
    domain: 'progressive.org',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Root',
    domain: 'theroot.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Source Newspaper (La Source)',
    domain: 'thelasource.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Straight Dope',
    domain: 'straightdope.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Stranger',
    domain: 'thestranger.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Texas Observer',
    domain: 'texasobserver.org',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Village Voice',
    domain: 'villagevoice.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Voice UK',
    domain: 'voice-online.co.uk',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Walrus',
    domain: 'thewalrus.ca',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Washington Spectator',
    domain: 'washingtonspectator.org',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Week',
    domain: 'theweek.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The World Can’t Wait',
    domain: 'worldcantwait.net',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'TheGrio',
    domain: 'thegrio.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Zero Hour',
    domain: 'thisisthezerohour.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'This Magazine',
    domain: 'this.org',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Towleroad',
    domain: 'towleroad.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'TreeHugger',
    domain: 'treehugger.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'TruthDig',
    domain: 'truthdig.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Truth Initiative',
    domain: 'thetruth.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'TruthOut',
    domain: 'truthout.org',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Truth Theory',
    domain: 'truththeory.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Unicorn Riot',
    domain: 'unicornriot.ninja',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Uproxx',
    domain: 'uproxx.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Upworthy',
    domain: 'upworthy.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Vanity Fair',
    domain: 'vanityfair.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Vegan Society',
    domain: 'vegansociety.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Venezuela Analysis',
    domain: 'venezuelaanalysis.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Vox',
    domain: 'vox.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Wall Street on Parade',
    domain: 'wallstreetonparade.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Washington Babylon',
    domain: 'washingtonbabylon.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Washington Press',
    domain: 'washingtonpress.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Washingtonian',
    domain: 'washingtonian.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Wear Your Voice',
    domain: 'wearyourvoicemag.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'We Hunted the Mammoth',
    domain: 'wehuntedthemammoth.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Well+Good',
    domain: 'wellandgood.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Who.What.Why',
    domain: 'whowhatwhy.org',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Wisconsin Examiner',
    domain: 'wisconsinexaminer.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Wonkette',
    domain: 'wonkette.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Workers World',
    domain: 'workers.org',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'World Socialist Web Site',
    domain: 'wsws.org',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Xtra Magazine',
    domain: 'xtramagazine.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Yes Magazine',
    domain: 'yesmagazine.org',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Young Turks',
    domain: 'tytnetwork.com',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Z Network',
    domain: 'znetwork.org',
    bias_labels: [
      {
        label: 'left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: '1News – New Zealand',
    domain: '1news.co.nz',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: '100 Mile Free Press',
    domain: '100milefreepress.net',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: '404 Media',
    domain: '404media.co',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: '604 Now',
    domain: '604now.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: '972 Magazine',
    domain: '972mag.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: '1600 Daily',
    domain: 'whitehouse.gov',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'ABC News',
    domain: 'abcnews.go.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'ABC News Australia',
    domain: 'abc.net.au',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'ABC11 Eyewitness News',
    domain: 'abc11.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Abbotsford News',
    domain: 'abbynews.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Above the Law',
    domain: 'abovethelaw.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Acadiana Advocate',
    domain: 'theadvocate.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'AceShowbiz',
    domain: 'aceshowbiz.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'ACLU',
    domain: 'aclu.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Ada Derana',
    domain: 'adaderana.lk',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Ada News',
    domain: 'theadanews.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Aeon',
    domain: 'aeon.co',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Affinity Magazine',
    domain: 'affinitymagazine.us',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'African Arguments',
    domain: 'africanarguments.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Africa News',
    domain: 'africanews.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Agassiz-Harrison Observer',
    domain: 'agassizharrisonobserver.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Ahval News',
    domain: 'ahvalnews.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Airdrie City View',
    domain: 'airdrietoday.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Aitkin Independent Age',
    domain: 'messagemedia.co',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Ajax News Advertiser',
    domain: 'durhamregion.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Akron Beacon Journal',
    domain: 'beaconjournal.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Al Jazeera',
    domain: 'aljazeera.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Al Monitor',
    domain: 'al-monitor.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Alamogordo Daily News',
    domain: 'alamogordonews.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Alan Guttmacher Institute',
    domain: 'guttmacher.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Alaska Highway News',
    domain: 'alaskahighwaynews.ca',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Albany Times-Union',
    domain: 'timesunion.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Aldergrove Star',
    domain: 'aldergrovestar.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'AllGov',
    domain: 'allgov.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Alliance Review',
    domain: 'the-review.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Alliston Herald',
    domain: 'simcoe.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'All That’s Interesting',
    domain: 'allthatsinteresting.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Almaguin News',
    domain: 'northbaynipissing.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'AM New York',
    domain: 'amny.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'America Magazine',
    domain: 'americamagazine.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'American Immigration Council',
    domain: 'americanimmigrationcouncil.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'American Public Media',
    domain: 'americanpublicmedia.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'American Purpose',
    domain: 'americanpurpose.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'America’s Health Rankings',
    domain: 'americashealthrankings.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Ames Tribune',
    domain: 'amestrib.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Amnesty International',
    domain: 'amnesty.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Ancaster News',
    domain: 'thespec.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Anderson Herald Bulletin',
    domain: 'heraldbulletin.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Andover Townsman',
    domain: 'andovertownsman.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Anniston Star',
    domain: 'annistonstar.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Anthropocene Magazine',
    domain: 'anthropocenemagazine.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Anti Defamation League',
    domain: 'adl.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'AOL',
    domain: 'aol.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'APM Reports',
    domain: 'apmreports.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Arizona Capitol Times',
    domain: 'azcapitoltimes.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Arizona Daily Star',
    domain: 'tucson.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Arizona Daily Sun',
    domain: 'azdailysun.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Arizona Republic',
    domain: 'azcentral.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Arkansas Times',
    domain: 'arktimes.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Arnprior Chronicle-Guide',
    domain: 'insideottawavalley.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'ARTE',
    domain: 'arte.tv',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Ashcroft-Cache Creek Journal',
    domain: 'ashcroftcachecreekjournal.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Asheville Citizen-Times',
    domain: 'citizen-times.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Ashland Independent',
    domain: 'dailyindependent.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Ashland Times-Gazette',
    domain: 'times-gazette.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Aspenia Online',
    domain: 'aspeniaonline.it',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Aspen Institute',
    domain: 'aspeninstitute.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Assiniboia Times',
    domain: 'saktoday.ca',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Associated Press',
    domain: 'apnews.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Atavist Magazine',
    domain: 'magazine.atavist.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Athabasca Advocate',
    domain: 'townandcountrytoday.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Athens Banner-Herald',
    domain: 'onlineathens.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Athens Daily Review',
    domain: 'athensreview.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Athens News Courier',
    domain: 'enewscourier.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Atlanta Black Star',
    domain: 'atlantablackstar.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Atlanta Journal-Constitution',
    domain: 'ajc.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Atlantic',
    domain: 'theatlantic.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Atlantic Media',
    domain: 'atlanticmedia.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'ATTN:',
    domain: 'attn.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Aurora Banner',
    domain: 'yorkregion.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Austin American-Statesman',
    domain: 'statesman.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Austin Daily Herald',
    domain: 'austindailyherald.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Autoblog',
    domain: 'autoblog.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'AV Club',
    domain: 'avclub.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Axios',
    domain: 'axios.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'BackChannel',
    domain: 'backchannel.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Balkan Insight',
    domain: 'balkaninsight.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Baltimore Sun',
    domain: 'baltimoresun.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Bangor Daily News',
    domain: 'bangordailynews.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Baptist News Global',
    domain: 'baptistnews.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Barrie Today',
    domain: 'barrietoday.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Battle Creek Enquirer',
    domain: 'battlecreekenquirer.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Baxter Bulletin',
    domain: 'baxterbulletin.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Bay Nature Magazine',
    domain: 'baynature.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'BBC News',
    domain: 'bbc.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Bedford Times-Mail',
    domain: 'tmnews.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Bellingcat',
    domain: 'bellingcat.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Bellingham Herald',
    domain: 'bellinghamherald.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Berkeleyside',
    domain: 'berkeleyside.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Berkley Center for Religion, Peace & World Affairs',
    domain: 'berkleycenter.georgetown.edu',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Berkshire Eagle',
    domain: 'berkshireeagle.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Berliner Zeitung',
    domain: 'berliner-zeitung.de',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Bighorn County News',
    domain: 'bighorncountynews.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Big Timber Pioneer',
    domain: 'bigtimberpioneer.net',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Bing News',
    domain: 'bing.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Birmingham Mail',
    domain: 'birminghammail.co.uk',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Black Enterprise',
    domain: 'blackenterprise.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Blackburn News',
    domain: 'blackburnnews.ca',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'BlackPressUSA',
    domain: 'blackpressusa.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Bleacher Report',
    domain: 'bleacherreport.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Bloomberg',
    domain: 'bloomberg.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Blooming Prairie Leader',
    domain: 'southernmiss.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Bloomington Herald-Times',
    domain: 'heraldtimesonline.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Bluefield Daily Telegraph',
    domain: 'bdtonline.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Bluestem Prairie',
    domain: 'bluestemprairie.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'BNN Bloomberg',
    domain: 'bnnbloomberg.ca',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Bonnyville Nouvelle',
    domain: 'lakelandtoday.ca',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Borgen Magazine',
    domain: 'borgenmagazine.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Borgen Project',
    domain: 'borgenproject.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Boston Globe',
    domain: 'bostonglobe.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Bowen Island Undercurrent',
    domain: 'bowenislandundercurrent.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Boy Genius Report',
    domain: 'bgr.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Bozeman Chronicle-Express',
    domain: 'chronicle-express.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Bozeman Daily Chronicle',
    domain: 'bozemandailychronicle.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Bracebridge',
    domain: 'muskokaregion.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Brennan Center for Justice',
    domain: 'brennancenter.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Brockton Enterprise',
    domain: 'enterprisenews.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Brookings Institute',
    domain: 'brookings.edu',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Brown Political Review',
    domain: 'brownpoliticalreview.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Bucyrus Telegraph-Forum',
    domain: 'bucyrustelegraphforum.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Bulletin of Atomic Scientists',
    domain: 'thebulletin.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Bundeszentrale für politische Bildung',
    domain: 'bpb.de)',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Burlington County Times',
    domain: 'burlingtoncountytimes.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Burlington Post',
    domain: 'insidehalton.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Burnaby Now',
    domain: 'burnabynow.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Burns Lake Lakes District News',
    domain: 'burnslakelakesdistrictnews.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Business Insider',
    domain: 'businessinsider.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Bustle Magazine',
    domain: 'bustle.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Buzzfeed',
    domain: 'buzzfeed.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Buzzfeed News',
    domain: 'buzzfeednews.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Byline Times',
    domain: 'bylinetimes.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Caledon Enterprise',
    domain: 'caledonenterprise.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Caledonia Courier',
    domain: 'caledoniacourier.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Cambridge Times',
    domain: 'cambridgetimes.ca',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Campbell River Mirror',
    domain: 'campbellrivermirror.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Canadaigua Daily Messenger',
    domain: 'mpnnow.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Canadaland',
    domain: 'canadalandshow.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Canary Media',
    domain: 'canarymedia.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Canora Courier',
    domain: 'sasktoday.ca',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Canton Repository',
    domain: 'cantonrep.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Capital Gazette',
    domain: 'capitalgazette.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Carbon County News',
    domain: 'carboncountynews.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Caribbean Life News',
    domain: 'caribbeanlifenews.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Carlsbad Current-Argus',
    domain: 'currentargus.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Carnegie Endowment for International Peace',
    domain: 'carnegieendowment.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Carolina Public Press',
    domain: 'carolinapublicpress.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Carriage Towne News',
    domain: 'carriagetownenews.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'CBC News',
    domain: 'cbc.ca',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'CBS Boston – WBZ-TV',
    domain: 'boston.cbslocal.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'CBS Los Angeles – KCBS',
    domain: 'losangeles.cbslocal.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'CBS News',
    domain: 'cbsnews.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'CBS New York',
    domain: 'newyork.cbslocal.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'CBS Seattle – Cw 11',
    domain: 'seattle.cbslocal.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Center for Advanced Defense studies',
    domain: 'c4ads.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Center for Global Development',
    domain: 'cgdev.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Center for Inquiry',
    domain: 'centerforinquiry.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Center for International Policy',
    domain: 'ciponline.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Center for a New American Security',
    domain: 'cnas.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Center for Popular Democracy',
    domain: 'populardemocracy.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Center for Public Integrity',
    domain: 'publicintegrity.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Center on Budget and Policy Priorities',
    domain: 'cbpp.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Chalkbeat',
    domain: 'chalkbeat.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Channel 4 News (UK)',
    domain: 'channel4.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Charleston Gazette Mail',
    domain: 'wvgazettemail.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Charlotte Observer',
    domain: 'charlotteobserver.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Cheddar',
    domain: 'cheddar.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Cheboygan Daily Tribune',
    domain: 'cheboygannews.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Chemainus Valley Courier',
    domain: 'chemainusvalleycourier.ca',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Cherry Hill Courier-Post',
    domain: 'courierpostonline.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Chicago Sun-Times',
    domain: 'chicago.suntimes.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Chickasha Express-Star',
    domain: 'chickashanews.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Chilliwack Progress',
    domain: 'theprogress.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'China Africa Project',
    domain: 'chinaafricaproject.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Christian Century Magazine',
    domain: 'christiancentury.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Citizen Truth',
    domain: 'citizentruth.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Citizens for Responsibility and Ethics in Washington (CREW)',
    domain: 'citizensforethics.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Citizens for Tax Justice',
    domain: 'ctj.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'CityLab',
    domain: 'citylab.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'City and State New York',
    domain: 'cityandstateny.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'CK NewsToday',
    domain: 'cknewstoday.ca',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'CKNX News Today',
    domain: 'cknxnewstoday.ca',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Claremore Daily Progress',
    domain: 'claremoreprogress.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Clarion Ledger',
    domain: 'clarionledger.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Clean Technica',
    domain: 'cleantechnica.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Clearwater Times',
    domain: 'clearwatertimes.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Cleburne Times Review',
    domain: 'cleburnetimesreview.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Clinton Herald',
    domain: 'clintonherald.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Cloverdale Reporter',
    domain: 'cloverdalereporter.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'CNBC',
    domain: 'cnbc.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Coast Mountain News',
    domain: 'coastmountainnews.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'COED',
    domain: 'coed.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Coldwater Daily Reporter',
    domain: 'thedailyreporter.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'ColoradoPolitics',
    domain: 'coloradopolitics.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Columbia Daily Tribune',
    domain: 'columbiatribune.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Columbia Journalism Review',
    domain: 'cjr.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Columbia Reports',
    domain: 'colombiareports.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Columbus Dispatch',
    domain: 'dispatch.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Committee to Investigate Russia',
    domain: 'investigaterussia.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Common Cause',
    domain: 'commoncause.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Commonweal Magazine',
    domain: 'commonwealmagazine.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'CommonWealth fund',
    domain: 'commonwealthfund.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Comox Valley Record',
    domain: 'comoxvalleyrecord.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Complex',
    domain: 'complex.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Connecticut Post',
    domain: 'ctpost.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Constitution Project',
    domain: 'constitutionproject.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Cooperstown Crier',
    domain: 'cooopercrier.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Corning Leader',
    domain: 'the-leader.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Corsicana Daily Sun',
    domain: 'corsicanadailysun.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Cowichan Valley Citizen',
    domain: 'cowichanvalleycitizen.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Cronkite News',
    domain: 'cronkitenews.azpbs.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'CrossCut.com',
    domain: 'crosscut.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Crossville Chronicle',
    domain: 'crossville-chronicle.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'CT Mirror',
    domain: 'ctmirror.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Cullman Times',
    domain: 'cullmantimes.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Cumberland Times-News',
    domain: 'times-news.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Cursor',
    domain: 'cursor.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Daily Commercial',
    domain: 'dailycommercial.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Daily Jeffersonian –',
    domain: 'daily-jeff.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Daily Monitor (Uganda)',
    domain: 'monitor.co.ug',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Daily Mirror',
    domain: 'mirror.co.uk',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Daily Nation',
    domain: 'nation.africa',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Daily News Journal',
    domain: 'dnj.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Daily Trust',
    domain: 'dailytrust.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Danville Commercial-News',
    domain: 'commerical-news.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Dawn',
    domain: 'dawn.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Dawson Creek Mirror',
    domain: 'dawsoncreekmirror.ca',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'DCist',
    domain: 'dcist.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'DCReport.org',
    domain: 'dcreport.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Deadline Hollywood',
    domain: 'deadline.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Death Penalty Information Center',
    domain: 'deathpenaltyinfo.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Deccan Herald',
    domain: 'deccanherald.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Debunking Denialism',
    domain: 'debunkingdenialism.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Defector',
    domain: 'defector.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Delaware Online – The News Journal',
    domain: 'delawareonline.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Delo',
    domain: 'delo.si',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Delta Optimist',
    domain: 'delta-optimist.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Democracy 21',
    domain: 'democracy21.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Democrat and Chronicle',
    domain: 'democratandchronicle.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Demos',
    domain: 'demos.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Denver Post',
    domain: 'denverpost.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Derry News',
    domain: 'derrynews.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Der Standard',
    domain: 'derstandard.at',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Detroit Free Press',
    domain: 'freep.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Didsbury Review',
    domain: 'mountainviewtoday.ca',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Die Zeit',
    domain: 'zeit.de',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Digg',
    domain: 'digg.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Dillon Tribune',
    domain: 'dillontribune.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Distractify',
    domain: 'distractify.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'DiversityInc',
    domain: 'diversityinc.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Dover Times-Reporter',
    domain: 'timesreporter.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Drug Policy Alliance – DPA',
    domain: 'drugpolicy.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Duncan Banner',
    domain: 'duncanbanner.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Dundalk Eagle',
    domain: 'dundalkeagle.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Dutch Review',
    domain: 'dutchreview.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'DW News',
    domain: 'dw.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Eagle Valley News',
    domain: 'eaglevalleynews.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Earth Institute',
    domain: 'earth.columbia.edu',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'EarthJustice',
    domain: 'earthjustice.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'East Bay Times',
    domain: 'eastbaytimes.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'East Gwillimbury Express',
    domain: 'thestar.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'East-West Center',
    domain: 'eastwestcenter.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Economic Policy Institute',
    domain: 'epi.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Economics.Help',
    domain: 'economicshelp.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Education Week',
    domain: 'edweek.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Educators Technology',
    domain: 'educatorstechnology.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'E&E News',
    domain: 'eenews.net',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Effingham Daily News',
    domain: 'effinghamdailynews.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Egyptian Streets',
    domain: 'egyptianstreets.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'EJ Insight',
    domain: 'ejinsight.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'El Diario NY',
    domain: 'eldiariony.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'El Pais',
    domain: 'elpais.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'El Paso Times',
    domain: 'elpasotimes.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Electronic Frontier Foundation',
    domain: 'eff.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Emerging Europe',
    domain: 'emerging-europe.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Empty Wheel',
    domain: 'emptywheel.net',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Engadget',
    domain: 'engadget.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Enid News & Eagle',
    domain: 'enidnews.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Environment America',
    domain: 'environmentamerica.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Environmental Defense Fund',
    domain: 'edf.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Erin Advocate',
    domain: 'orangeville.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'ESPN',
    domain: 'espn.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Eugene Register-Guard',
    domain: 'registerguard.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'EU Observer',
    domain: 'euobserver.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'EurActiv',
    domain: 'euractiv.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Eurasianet',
    domain: 'eurasianet.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Eurasia Review',
    domain: 'eurasiareview.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Euronews',
    domain: 'euronews.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'EuroWeekly News',
    domain: 'euroweeklynews.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Evansville Courier & Press',
    domain: 'courierpress.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Exposing the Truth',
    domain: 'exposingtruth.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Fact/Myth',
    domain: 'factmyth.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Fairness and Accuracy in Reporting',
    domain: 'fair.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Fair Observer',
    domain: 'fairobserver.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'FairVote',
    domain: 'fairvote.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Faribault Daily News',
    domain: 'southernminn.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Fast Company',
    domain: 'fastcompany.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Fayette Tribune',
    domain: 'fayettetribune.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Feminist Frequency',
    domain: 'feministfrequency.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Fight for the Future',
    domain: 'fightforthefuture.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'FivethirtyEight',
    domain: 'fivethirtyeight.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Flin Flon Reminder',
    domain: 'thereminder.ca',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Food Navigator',
    domain: 'foodnavigator.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Foreign Policy in Focus',
    domain: 'fpif.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Fort Erie Post',
    domain: 'niagarathisweek.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Fort Worth Weekly',
    domain: 'fwweekly.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'France Info',
    domain: 'francetvinfo.fr',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Freakonomics',
    domain: 'freakonomics.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Fremont News-Messenger',
    domain: 'thenews-messenger.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'FreeThink',
    domain: 'freethink.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Fresno Bee',
    domain: 'fresnobee.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Future of Life Institute',
    domain: 'futureoflife.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Gadsden Times',
    domain: 'gadsdentimes.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Gainesville Daily Register',
    domain: 'gainesvilleregister.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Gainesville Sun',
    domain: 'gainesville.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Gaston Gazette',
    domain: 'gastongazette.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Gazeta Wyborcza',
    domain: 'wyborcza.pl',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Glamour Magazine',
    domain: 'glamour.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Glendive Ranger-Review',
    domain: 'rangerreview.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Global Citizen',
    domain: 'globalcitizen.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Global News',
    domain: 'globalnews.ca',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Global Post',
    domain: 'pri.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Global Risk Insights',
    domain: 'globalriskinsights.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Global Times',
    domain: 'globaltimes.cn',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Gloucester Daily Times',
    domain: 'gloucestertimes.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'GMA Network',
    domain: 'gmanetwork.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Golden Star –',
    domain: 'thegoldenstar.net',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Goldstream News Gazette',
    domain: 'goldstreamgazette.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Gothamist',
    domain: 'gothamist.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Governing Magazine',
    domain: 'governing.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Government Accountability Project',
    domain: 'whistleblower.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Government Executive',
    domain: 'govexec.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Grand Rapids Herald-Review',
    domain: 'grandrapidsmn.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Greensburg Daily News',
    domain: 'greensburgdailynews.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Greenville Herald-Banner',
    domain: 'heraldbanner.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Grid News',
    domain: 'grid.news',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Grist',
    domain: 'grist.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Grove City Allied News',
    domain: 'alliednews.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Guelph Mercury Tribune',
    domain: 'guelphmercury.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Gun Violence Archive',
    domain: 'gunviolencearchive.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Hagerstown Herald-Mail',
    domain: 'heraldmailmedia.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Haida Gwaii Observer',
    domain: 'haidagwaiiobserver.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Hamilton Mountain News',
    domain: 'hamiltonnews.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Harpers',
    domain: 'harpers.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Hartford Courant',
    domain: 'courant.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Harvard Political Review',
    domain: 'harvardpolitics.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Hattiesburg American',
    domain: 'hattiesburgamerican.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Haverhill Gazette',
    domain: 'hgazette.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Hawaii Tribune-Herald',
    domain: 'hawaiitribune-herald.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Health Magazine',
    domain: 'health.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'HealthyWay',
    domain: 'healthyway.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Heavy',
    domain: 'heavy.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Hechinger Report',
    domain: 'hechingerreport.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Helsingin Sanomat',
    domain: 'hs.fi',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Helsinki Times',
    domain: 'helsinkitimes.fi',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Henderson Gleaner',
    domain: 'thegleaner.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Herkimer Times-Telegram',
    domain: 'timestelegram.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'High Country News',
    domain: 'hcn.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Highline',
    domain: 'highline.huffingtonpost.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Hillsdale Daily News',
    domain: 'hillsdale.net',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'History News Network',
    domain: 'historynewsnetwork.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'HITC',
    domain: 'hitc.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Holland Sentinel',
    domain: 'hollandsentinel.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Hollywood Reporter',
    domain: 'hollywoodreporter.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Honolulu Civil Beat',
    domain: 'civilbeat.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Honolulu Star-Advertiser',
    domain: 'staradvertiser.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Hope Standard',
    domain: 'hopestandard.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Hornell Evening Tribune',
    domain: 'eveningtribune.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'HotNews',
    domain: 'hotnews.ro',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Houma Courier',
    domain: 'houmatoday.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Houston Chronicle',
    domain: 'chron.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Houston Today',
    domain: 'houston-today.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Human Rights Defense Center',
    domain: 'humanrightsdefensecenter.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Human Rights Watch',
    domain: 'hrw.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Humanium',
    domain: 'humanium.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Hunterdon County Democrat',
    domain: 'nj.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Huntsville Item',
    domain: 'itemonline.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Ice News',
    domain: 'icenews.is',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'ICI Radio-Canada',
    domain: 'ici.radio-canada.ca',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Idaho Press-Tribune',
    domain: 'idahopress.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'If America Knew',
    domain: 'ifamericaknew.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'IFL Science',
    domain: 'iflscience.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Independent Australia',
    domain: 'independentaustralia.net',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'iNews',
    domain: 'inews.co.uk',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'InfoBae',
    domain: 'infobae.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Infoplease',
    domain: 'infoplease.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Inquisitr',
    domain: 'inquisitr.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Inside Edition',
    domain: 'insideedition.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'InsideEVs',
    domain: 'insideevs.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Inside Higher Ed',
    domain: 'insidehighered.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Inside Philanthropy',
    domain: 'insidephilanthropy.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Insider',
    domain: 'insider.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'InsideClimate News',
    domain: 'insideclimatenews.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Institute for Government',
    domain: 'instituteforgovernment.org.uk',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Institute for Middle East Understanding',
    domain: 'imeu.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Institute on Taxation and Economic Policy (ITEP)',
    domain: 'itep.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Interfax-Ukraine',
    domain: 'en.interfax.com.ua',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'International Business Times',
    domain: 'ibtimes.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'International Center for Research on Women',
    domain: 'icrw.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'International Crisis Group',
    domain: 'crisisgroup.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Interpreter Magazine',
    domain: 'interpretermag.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Inverse',
    domain: 'inverse.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Ipolitics',
    domain: 'ipolitics.ca',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Irish Daily Mirror',
    domain: 'irishmirror.ie',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Israel21c',
    domain: 'israel21c.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Ithaca Journal',
    domain: 'ithacajournal.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The New Humanitarian',
    domain: 'thenewhumanitarian.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Jackson Free Press',
    domain: 'jacksonfreepress.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Jackson Sun',
    domain: 'jacksonsun.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Jacksonville Progress',
    domain: 'jacksonvilleprogress.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Jalopnik',
    domain: 'jalopnik.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Japan Today',
    domain: 'japantoday.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Jefferson Public Radio',
    domain: 'ijpr.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Jeffersonville News and Tribune',
    domain: 'newsandtribune.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Jihadica',
    domain: 'jihadica.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Joint Center for Polititical and Economic Studies',
    domain: 'jointcenter.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Journal Politics and Society',
    domain: 'helvidius.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Jstor Daily',
    domain: 'daily.jstor.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Judith Basin Press',
    domain: 'judithbasinpress.net',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'JURIST',
    domain: 'jurist.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Just Security',
    domain: 'justsecurity.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Kaiser Family Foundation',
    domain: 'kff.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Kaiser Health News',
    domain: 'khn.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KAJX – NPR – Aspen',
    domain: 'aspenpublicradio.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KALW – NPR – San Francisco',
    domain: 'kalw.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Kansas City Star',
    domain: 'kansascity.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KASU – NPR – Jonesboro',
    domain: 'kasu.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KAWC – NPR – Yuma',
    domain: 'kawc.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KAZU – NPR – Pacific Grove',
    domain: 'kazu.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KBBI – NPR – Homer',
    domain: 'kbbi.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KBRW – NPR – Barrow',
    domain: 'kbrw.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KBSA – NPR – El Dorado',
    domain: 'redriverradio.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KBUT – NPR – Crested Butte',
    domain: 'kbut.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KCAW – NPR – Sitka',
    domain: 'kcaw.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KCBX – NPR – San Luis Obispo',
    domain: 'kcbx.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KCFC – NPR – Boulder',
    domain: 'cpr.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KCHO – NPR – Chico',
    domain: 'mynspr.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KCLU – NPR – Santa Barbara',
    domain: 'kclu.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KCNC-TV – CBS Denver',
    domain: 'denver.cbslocal.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KCRW – NPR – Santa Monica',
    domain: 'kcrw.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KCHU – NPR – Valdez',
    domain: 'kchu.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KDLG – NPR – Dillingham',
    domain: 'kdlg.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KDLL – NPR – Kenai',
    domain: 'kdll.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KDNK – NPR – Carbondale',
    domain: 'kdnk.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Kelowna Capital News',
    domain: 'kelownacapnews.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Kenosha News',
    domain: 'kenoshanews.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Kent Record-Courier',
    domain: 'record-courier.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Keremeos Review',
    domain: 'keremeosreview.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KFSK – NPR – Petersburg',
    domain: 'kfsk.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KFSN – ABC30 Fresno News',
    domain: 'abc30.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KGO – ABC7 News',
    domain: 'abc7news.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KHNS – NPR – Haines',
    domain: 'khns.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KHSU – NPR – Arcata',
    domain: 'khsu.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Kilgore News Herald',
    domain: 'kilgorenewsherald.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Kitimat Northern Sentinel',
    domain: 'northernsentinel.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KIYU – NPR – Galena',
    domain: 'kiyu.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KJZZ – NPR – Phoenix',
    domain: 'kjzz.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KMXT – NPR – Kodiak',
    domain: 'kmxt.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KNAU – NPR – Flagstaff',
    domain: 'knau.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Knight Foundation',
    domain: 'knightfoundation.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KNTV – NBC Bay Area',
    domain: 'nbcbayarea.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KOCO News 5',
    domain: 'koco.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KODK – NPR – Kodiak',
    domain: 'kmtx.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Kokomo Tribune',
    domain: 'kokomotribune.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Kotaku',
    domain: 'kotaku.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KOVR – CBS Sacramento',
    domain: 'sacramento.cbslocal.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KPCC – NPR – Pasadena',
    domain: 'kpcc.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KPIC CBS 4',
    domain: 'kpic.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KPIX – CBS San Francisco',
    domain: 'sanfrancisco.cbslocal.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KQED',
    domain: 'kqed.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KRBD – NPR – Ketchikan',
    domain: 'krbd.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KRCB – NPR – Rohnert Park',
    domain: 'norcalpublicmedia.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KSJD – NPR – Cortez',
    domain: 'ksjd.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KSKA – NPR – Anchorage',
    domain: 'alaskapublic.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KSTK – NPR – Wrangell',
    domain: 'kstk.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KTNA – NPR – Talkeetna',
    domain: 'ktna.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KTOO – NPR – Juneau',
    domain: 'ktoo.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KTRK – ABC13 – Houston',
    domain: 'abc13.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KUAC – NPR – Fairbanks',
    domain: 'kuac.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KUAF – NPR – Fayetteville',
    domain: 'kuaf.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KUAR – NPR – Little Rock',
    domain: 'ualrpublicradio.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KUAZ – NPR – Tucson',
    domain: 'news.azpm.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KUCB – NPR – Unalaska',
    domain: 'kucb.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KUOW NPR',
    domain: 'kuow.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Kurdistan 24',
    domain: 'kurdistan24.net',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KUSC – NPR – Los Angeles',
    domain: 'kusc.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KVPR – NPR – Fresno',
    domain: 'kvpr.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KXPR – NPR – Sacramento',
    domain: 'capradio.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Kyiv Independent',
    domain: 'kyivindependent.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KYUK – NPR – Yukon',
    domain: 'kyuk.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KZYX – NPR – Philo',
    domain: 'kzyx.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Laconia Daily Sun',
    domain: 'laconiadailysun.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'La Dépêche du Midi',
    domain: 'ladepeche.fr',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Ladysmith Chronicle',
    domain: 'ladysmithchronicle.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Lafayette Daily Advertiser',
    domain: 'theadvertiser.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Lafayette Journal & Courier',
    domain: 'jconline.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Lake Country Calendar',
    domain: 'lakecountrycalendar.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Lake Cowichan Gazette',
    domain: 'lakecowichangazette.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'La Junta Tribune-Democrat',
    domain: 'lajuntatribunedemocrat.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Langley Advance Times',
    domain: 'langleyadvancetimes.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'La Presse',
    domain: 'lapresse.ca',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'La Repubblica',
    domain: 'repubblica.it',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'La Stampa',
    domain: 'lastampa.it',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'LA Times',
    domain: 'latimes.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Las Vegas Sun',
    domain: 'lasvegassun.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Latin Times',
    domain: 'latintimes.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Laurel Outlook',
    domain: 'laureloutlook.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Law & Crime',
    domain: 'lawandcrime.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Lebanon Reporter',
    domain: 'reporter.net',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Left Justified',
    domain: 'leftjustified.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Le Monde',
    domain: 'lemonde.fr',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Le Soleil (Quebec)',
    domain: 'lesoleil.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'LessWrong',
    domain: 'lesswrong.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Lethbridge Herald',
    domain: 'lethbridgeherald.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Lexington Herald Leader',
    domain: 'kentucky.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Lewiston News-Argus',
    domain: 'lewistonnews.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Liberation (Paris)',
    domain: 'liberation.fr',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Liberty Times – Taiwan',
    domain: 'news.ltn.com.tw',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Lifehacker',
    domain: 'lifehacker.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Lincoln Courier',
    domain: 'lincolncourier.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Livingston County Daily Press & Argus',
    domain: 'livingstondaily.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Livingston Enterprise',
    domain: 'livingstonenterprise.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Lockport Union-Sun & Journal',
    domain: 'lockportjournal.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'LondonNewsToday.ca',
    domain: 'londonnewstoday.ca',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Los Angeles Magazine',
    domain: 'lamag.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Maclean’s Magazine',
    domain: 'macleans.ca',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Mad in America',
    domain: 'madinamerica.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Mainichi Shimbun',
    domain: 'mainichi.jp',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Manchester Evening News',
    domain: 'manchestereveningnews.co.uk',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Manila Bulletin',
    domain: 'mb.com.ph',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Mankato Free Press',
    domain: 'mankatofreepress.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Maplight',
    domain: 'maplight.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Marion Star',
    domain: 'marionstar.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Market Realist',
    domain: 'marketrealist.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Marshall News Messenger',
    domain: 'marshallnewsmessenger.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Martinsville Reporter-Times',
    domain: 'reporter-times.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Maryland Matters',
    domain: 'marylandmatters.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Massillon Independent',
    domain: 'indeonline.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'McAlester News-Capital',
    domain: 'mcalesternews.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'McClatchy DC',
    domain: 'mcclatchydc.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'McDonough County Voice',
    domain: 'mcdonoughvoice.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'MediaFile',
    domain: 'mediafiledc.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Mediapart',
    domain: 'mediapart.fr',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Medium',
    domain: 'medium.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Men’s Health Magazine',
    domain: 'menshealth.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Men’s Journal',
    domain: 'mensjournal.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Mesabi Tribune',
    domain: 'mesabitribune.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Metro',
    domain: 'metro.us',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Metro UK',
    domain: 'metro.co.uk',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'New Haven Register',
    domain: 'nhregister.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Mexico Daily News',
    domain: 'mexiconewsdaily.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Miami Herald',
    domain: 'miamiherald.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'MIC',
    domain: 'mic.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Middle East Eye',
    domain: 'middleeasteye.net',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Migration Policy Institute',
    domain: 'migrationpolicy.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Milford Daily News',
    domain: 'milforddailynews.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Milken Institute',
    domain: 'milkeninstute.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Milledgeville Union-Recorder',
    domain: 'unionrecorder.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Miles City Star',
    domain: 'milescitystar.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Milwaukee Journal-Sentinal',
    domain: 'jsonline.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Mineral Well Index',
    domain: 'weatherforddemocrat.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Minneapolis Star-Tribune',
    domain: 'startribune.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Minnesota Public Radio (MPR)',
    domain: 'mprnews.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'MinnPost',
    domain: 'minnpost.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Mississauga News',
    domain: 'mississauga.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Mississippi Today',
    domain: 'mississippitoday.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Money Talks News',
    domain: 'moneytalksnews.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Mongabay',
    domain: 'news.mongabay.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Montgomery Advertiser',
    domain: 'montgomeryadvertiser.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Montgomery Herald',
    domain: 'montgomery-herald.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Morning Brew',
    domain: 'morningbrew.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Moscow Times',
    domain: 'themoscowtimes.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Mother Jones',
    domain: 'motherjones.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Mother Nature Network',
    domain: 'mnn.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Moultrie Observer',
    domain: 'moultrieobserver.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'MSN.com',
    domain: 'msn.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Muncie Star Press',
    domain: 'thestarpress.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Naked Capitalism',
    domain: 'nakedcapitalism.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Nanaimo News Bulletin',
    domain: 'nanaimobulletin.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Naples Daily News',
    domain: 'naplesnews.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'National Center for Transgender Equality',
    domain: 'transequality.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'National Monitor',
    domain: 'natmonitor.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'National Newswatch',
    domain: 'nationalnewswatch.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'National Observer',
    domain: 'nationalobserver.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'National Youth Right Association',
    domain: 'youthrights.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Natural Resource Governance Institute',
    domain: 'resourcegovernance.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Nature Conservancy',
    domain: 'nature.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'NBC 5 – Dallas – Fort Worth – KXAS',
    domain: 'nbcdfw.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'NBC 10 Philadelphia – WCAU',
    domain: 'nbcphiladelphia.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'NBC Chicago – WMAQ',
    domain: 'nbcchicago.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'NBC Los Angeles – KNBC',
    domain: 'nbclosangeles.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'NBC News',
    domain: 'nbcnews.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'NBCNewYork.com',
    domain: 'nbcnewyork.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'NDTV',
    domain: 'ndtv.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'New America Foundation',
    domain: 'newamerica.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Newburyport Daily News',
    domain: 'newburyportnews.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'New Bedford Standard-Times',
    domain: 'southcoasttoday.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'New Castle News',
    domain: 'ncnewsonline.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'New Europe',
    domain: 'neweurope.eu',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'New Hamburg Independent',
    domain: 'newhamburgindependent.ca',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'New Indian Express',
    domain: 'newindianexpress.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'New Jersey Herald',
    domain: 'njherald.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'New Left Review',
    domain: 'newleftreview.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'New Matilda',
    domain: 'newmatilda.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'News1130 & City News',
    domain: 'citynews1130.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'New Westminster Record',
    domain: 'newwestrecord.ca',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'New York Daily News',
    domain: 'nydailynews.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'New York Times',
    domain: 'nytimes.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'News and Guts',
    domain: 'newsandgutsmedia.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Newsday',
    domain: 'newsday.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Newser',
    domain: 'newser.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'NewsHub',
    domain: 'newshub.co.nz',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Newsy',
    domain: 'newsy.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Niagara Falls Review',
    domain: 'niagarafallsreview.ca',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Niagara Gazette',
    domain: 'niagara-gazette.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Nieman Journalism Lab',
    domain: 'niemanlab.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Niskanen Center',
    domain: 'niskanencenter.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'North Bay Bohemian',
    domain: 'bohemian.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'North Delta Reporter',
    domain: 'northdeltareporter.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'North Island Gazette',
    domain: 'northislandgazette.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'North Shore News',
    domain: 'nsnews.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'North Thompson Star-Journal',
    domain: 'barrierestarjournal.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Northumberland News',
    domain: 'northumberlandnews.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'North York Mirror',
    domain: 'therecord.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Norwich Bulletin',
    domain: 'norwichbulletin.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'NOWNews Today',
    domain: 'nownews.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'NRC',
    domain: 'nrc.nl',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'NPR',
    domain: 'npr.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Oak Bay News',
    domain: 'oakbaynews.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Ocala StarBanner',
    domain: 'ocala.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'OCWeekly',
    domain: 'ocweekly.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Oil and Water Don’t Mix',
    domain: 'oilandwaterdontmix.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Okotoks Western Wheel',
    domain: 'westernwheel.ca',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'OneIndia',
    domain: 'oneindia.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Opelousas Daily World',
    domain: 'dailyworld.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'openDemocracy',
    domain: 'opendemocracy.net',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Open the Government',
    domain: 'openthegovernment.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Orlando Sentinel',
    domain: 'orlandosentinel.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Oskaloosa Herald',
    domain: 'oskaloosa.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Ottumwa Courier',
    domain: 'ottumwacourier.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Our World In Data',
    domain: 'ourworldindata.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Outside Online',
    domain: 'outsideonline.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Outside The Beltway',
    domain: 'outsidethebeltway.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Pacific Standard Magazine',
    domain: 'psmag.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Palestine Herald-Press',
    domain: 'palestineherald.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Palm Beach Daily News',
    domain: 'palmbeachdailynews.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Panola Watchman',
    domain: 'panolawatchman.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Panama City News-Herald',
    domain: 'newsherald.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Parksville Qualicum Beach News',
    domain: 'pqbnews.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Parry Sound Beacon Star',
    domain: 'parrysound.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Patriotic Millionaires',
    domain: 'patrioticmillionaires.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Pauls Valley Democrat',
    domain: 'pualsvalleydailydemocrat.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'PBS News Hour',
    domain: 'pbs.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Peace Arch News',
    domain: 'peacearchnews.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Pekin Daily Times',
    domain: 'pekintimes.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Penticton Western News',
    domain: 'pentictonwesternnews.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Peninsula News Review',
    domain: 'peninsulanewsreview.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Peterborough Examiner',
    domain: 'thepeterboroughexaminer.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Petoskey News-Review',
    domain: 'petoskeynews.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Pharos Tribune',
    domain: 'pharostribune.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Philadelphia Inquirer',
    domain: 'inquirer.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Philippine Daily Inquirer',
    domain: 'inquirer.net',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Philippine Star',
    domain: 'philstar.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Philly Voice',
    domain: 'phillyvoice.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Phoenix News Times',
    domain: 'phoenixnewtimes.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Pioneer Valley Advocate',
    domain: 'valleyadvocate.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Pique NewsMagazine',
    domain: 'piquenewsmagazine.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Politico',
    domain: 'politico.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Politico Europe',
    domain: 'politico.eu',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Politifact',
    domain: 'politifact.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Polygon',
    domain: 'polygon.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Pontiac Daily Leader',
    domain: 'pontiacdailyleader.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Population Connection',
    domain: 'populationconnection.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Port Alberni Valley News',
    domain: 'albernivalleynews.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Port Clinton News-Herald',
    domain: 'portclintonnewsherald.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Port Colborne Leader',
    domain: 'stcatharinesstandard.ca',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Portland Press-Herald',
    domain: 'pressherald.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Portland Tribune',
    domain: 'pamplinmedia.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Portsmouth Herald',
    domain: 'seacoastonline.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Positive News',
    domain: 'positive.news',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Poughkeepsie Journal',
    domain: 'poughkeepsiejournal.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Powell River Peak',
    domain: 'prpeak.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Prince George Citizen',
    domain: 'princegeorgecitizen.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Prison Legal News',
    domain: 'prisonlegalnews.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Private Eye',
    domain: 'private-eye.co.uk',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Preston Citizen',
    domain: 'hjnews.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Prince Rupert Northern View',
    domain: 'thenorthernview.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Princeton Times',
    domain: 'ptonline.net',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Project on Government Insight',
    domain: 'pogo.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Project Syndicate',
    domain: 'project-syndicate.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Propublica',
    domain: 'propublica.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Prospect Magazine',
    domain: 'prospectmagazine.co.uk',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Protocol',
    domain: 'protocol.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Providence Journal',
    domain: 'providencejournal.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Public Citizen',
    domain: 'citizen.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Public News Service',
    domain: 'publicnewsservice.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Publico',
    domain: 'publico.es',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Pueblo Chieftain',
    domain: 'chieftain.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Pulse Nigeria',
    domain: 'pulse.ng',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Quartz',
    domain: 'qz.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Quesnel Cariboo Observer',
    domain: 'quesnelobserver.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Quincy Patriot Ledger',
    domain: 'patriotledger.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Radio Free Asia',
    domain: 'rfa.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Radio Television Marti',
    domain: 'radiotelevisionmarti.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Raleigh News & Observer',
    domain: 'newsobserver.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Rappler',
    domain: 'rappler.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'RationalWiki',
    domain: 'rationalwiki.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Relevant Magazine',
    domain: 'relevantmagazine.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Religion News Service',
    domain: 'religionnews.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Religion & Politics',
    domain: 'religionandpolitics.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Represent.us',
    domain: 'represent.us',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'RetailWire',
    domain: 'retailwire.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Reveal',
    domain: 'revealnews.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Revelstoke Review',
    domain: 'revelstokereview.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Richmond News',
    domain: 'richmond-news.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Richmond Palladium-Item',
    domain: 'pal-item.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Richmond Register',
    domain: 'richmondregister.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Ridgecrest Daily Independent',
    domain: 'ridgecrestca.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Right Web',
    domain: 'rightweb.irc-online.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'RocketNews',
    domain: 'rocketnews.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Rockford Register Star',
    domain: 'rrstar.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Rock Hill Herald',
    domain: 'heraldonline.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Rockwall County Herald-Banner',
    domain: 'rockwallheraldbanner.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Rocky Mountain Institute',
    domain: 'rmi.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Rocky Mountain Outlook',
    domain: 'rmoutlook.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Rolling Out',
    domain: 'rollingout.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Roosevelt Institute',
    domain: 'rooseveltinstitute.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Rosebud Independent Press',
    domain: 'independent-press.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Royce City Herald-Banner',
    domain: 'roysecityheraldbanner.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Saanich News',
    domain: 'saanichnews.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Sacramento Bee',
    domain: 'sacbee.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Salina Journal',
    domain: 'salina.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Salisbury Daily Times',
    domain: 'delmarvanow.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Salmon Arm Observer',
    domain: 'saobserver.net',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Salt Lake Tribune',
    domain: 'sltrib.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'San Antonio Express',
    domain: 'mysanantonio.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'San Diego Reader',
    domain: 'sandiegoreader.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'San Francisco Chronicle',
    domain: 'sfchronicle.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'San Francisco Examiner',
    domain: 'sfexaminer.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'San Jose Mercury News',
    domain: 'mercurynews.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'San Luis Obispo Tribune',
    domain: 'sanluisobispo.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Santa Barbara Independent',
    domain: 'independent.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Sapiens',
    domain: 'sapiens.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'SarniaNewsToday',
    domain: 'sarnianewstoday.ca',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Saudi Gazette',
    domain: 'saudigazette.com.sa',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Scarborough Mirror',
    domain: 'toronto.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Sciencing',
    domain: 'sciencing.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'ScoopWhoop',
    domain: 'scoopwhoop.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Scroll.in',
    domain: 'scroll.in',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Seattle Post-Intelligencer',
    domain: 'seattlepi.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Seattle Times',
    domain: 'seattletimes.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Sechelt Coast Reporter',
    domain: 'coastreporter.net',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Self Magazine',
    domain: 'self.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Sentencing Project',
    domain: 'sentencingproject.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'SFGate',
    domain: 'sfgate.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'ShareAmerica',
    domain: 'share.america.gov',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Sharon Herald',
    domain: 'sharonherald.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Shelby Star',
    domain: 'shelbystar.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Showbiz411',
    domain: 'showbiz411.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Similkameen Spotlight',
    domain: 'similkameenspotlight.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Smithers Interior News',
    domain: 'interior-news.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Snopes',
    domain: 'snopes.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Sojourners',
    domain: 'sojo.net',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Somerset Commonwealth-Journal',
    domain: 'somerset-kentucky.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Sooke News Mirror',
    domain: 'sookenewsmirror.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'SooToday.com',
    domain: 'sootoday.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'South China Morning Post',
    domain: 'scmp.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Special Broadcasting Service',
    domain: 'sbs.com.au',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Spiegel Online',
    domain: 'spiegel.de',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Spin (Magazine)',
    domain: 'spin.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Sports Illustrated',
    domain: 'si.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Springfield News-Leader',
    domain: 'news-leader.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Squamish Chief',
    domain: 'squamishchief.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'St. Albert Gazette',
    domain: 'stalbertgazette.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'St. Augustine Record',
    domain: 'staugustine.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Stamford Advocate',
    domain: 'stamfordadvocate.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'STAT (News)',
    domain: 'statnews.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'St. Clair News-Aegis',
    domain: 'newsaegis.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Stepfeed',
    domain: 'stepfeed.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Stillwater County News',
    domain: 'stillwatercountynews.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Stilwell Democrat',
    domain: 'stilwelldemocrat.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Stop Fake',
    domain: 'stopfake.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Stuff',
    domain: 'stuff.co.nz',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Sturgis Journal',
    domain: 'sturgisjournal.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Successful Farming Magazine',
    domain: 'agriculture.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Süddeutsche Zeitung',
    domain: 'sueddeutsche.de',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Summerland Review',
    domain: 'summerlandreview.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Sunbury Daily Item',
    domain: 'dailyitem.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Sunlight Foundation',
    domain: 'sunlightfoundation.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Surrey Now-Leader',
    domain: 'surreynowleader.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'SWI – Swissinfo.ch',
    domain: 'swissinfo.ch',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Taipei Times',
    domain: 'taipeitimes.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Taiwan News',
    domain: 'taiwannews.com.tw',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Tallahasee Democrat',
    domain: 'tallahassee.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Tampa Bay Times',
    domain: 'tampabay.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Task and Purpose',
    domain: 'taskandpurpose.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Taunton Daily Gazette',
    domain: 'tauntongazette.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Tax Justice Network',
    domain: 'taxjustice.net',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Tax Policy Center',
    domain: 'taxpolicycenter.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'TCPalm – Treasure Coast News',
    domain: 'tcpalm.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'TechCrunch',
    domain: 'techcrunch.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Techdirt',
    domain: 'techdirt.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Terrace Standard',
    domain: 'terracestandard.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Terre Haute Tribune-Star',
    domain: 'tribstar.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Terry Tribune',
    domain: 'terrytribune.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Texas Monthly',
    domain: 'texasmonthly.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Texas Tribune',
    domain: 'texastribune.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The 74',
    domain: 'the74million.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Age (Australia)',
    domain: 'theage.com.au',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Asahi Shimbun',
    domain: 'asahi.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Augusta Chronicle',
    domain: 'augustachronicle.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Baltimore Banner',
    domain: 'thebalitmorebanner.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Belfer Center for Science and International Affairs',
    domain: 'belfercenter.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Bureau of Investigative Journalism',
    domain: 'thebureauinvestigates.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Caravan',
    domain: 'caravanmagazine.in',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Century Foundation',
    domain: 'tcf.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Christian Left',
    domain: 'thechristianleft.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Chronicle of Higher Education',
    domain: 'chronicle.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Citizen',
    domain: 'thecitizen.org.au',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The City',
    domain: 'thecity.nyc',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Coloradoan',
    domain: 'coloradoan.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Colorado Sun',
    domain: 'coloradosun.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Council of Canadians',
    domain: 'canadians.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Courier-Journal',
    domain: 'courier-journal.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Daily Climate',
    domain: 'dailyclimate.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Daily Hive',
    domain: 'dailyhive.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Daily Star',
    domain: 'thedailystar.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Daily Tarheel',
    domain: 'dailytarheel.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Day (New London)',
    domain: 'theday.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Dominion Post',
    domain: 'dominionpost.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The European Council on Foreign Relations (ECFR)',
    domain: 'ecfr.eu',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Express-Times (Lehigh Valley)',
    domain: 'lehighvalleylive.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Forward',
    domain: 'forward.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Fulcrum',
    domain: 'thefulcrum.us',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Garden Island',
    domain: 'thegardenisland.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Glasgow Herald',
    domain: 'heraldscotland.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Goshen News',
    domain: 'goshennews.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Guardian',
    domain: 'theguardian.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Hawk Eye',
    domain: 'thehawkeye.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Herald (Everett)',
    domain: 'heraldnet.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Hill Times',
    domain: 'hilltimes.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Hindu',
    domain: 'newsite.thehindu.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Humanist Magazine',
    domain: 'thehumanist.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Hutchinson News',
    domain: 'hutchnews.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Independent',
    domain: 'independent.co.uk',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Independent and Free Press',
    domain: 'theifp.ca',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Indian Express',
    domain: 'indianexpress.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Intercept',
    domain: 'theintercept.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Irish Times',
    domain: 'irishtimes.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Irrawaddy',
    domain: 'irrawaddy.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Jakarta Post',
    domain: 'thejakartapost.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'TheJournal.ie',
    domain: 'thejournal.ie',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Journalist’s Resource',
    domain: 'journalistsresource.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Journal News',
    domain: 'lohud.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Korea Times',
    domain: 'koreatimes.co.kr',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Ledger',
    domain: 'theledger.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Lincoln Project',
    domain: 'lincolnproject.us',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The List',
    domain: 'thelist.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Local (Norway)',
    domain: 'thelocal.no',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Maui News',
    domain: 'mauinews.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Moderate Voice',
    domain: 'themoderatevoice.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Motley Fool',
    domain: 'fool.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The National – Scotland',
    domain: 'thenational.scot',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The New Arab',
    domain: 'alaraby.co.uk',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The News Minute',
    domain: 'thenewsminute.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The New Tropic',
    domain: 'thenewtropic.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The News Tribune',
    domain: 'thenewstribune.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The News-Times (Danbury)',
    domain: 'newstimes.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Next Web (TNW)',
    domain: 'thenextweb.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Odyssey Online',
    domain: 'theodysseyonline.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Olympian',
    domain: 'theolympian.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Organized Crime and Corruption Reporting Project',
    domain: 'occrp.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Palm Beach Post',
    domain: 'palmbeachpost.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Patriot-News',
    domain: 'pennlive.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Plain Dealer',
    domain: 'cleveland.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Press Democrat',
    domain: 'pressdemocrat.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Punch (Nigeria)',
    domain: 'punchng.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Quint',
    domain: 'thequint.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Record (New Jersey)',
    domain: 'northjersey.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'TheRighting',
    domain: 'therighting.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Ringer',
    domain: 'theringer.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Saturday Paper',
    domain: 'thesaturdaypaper.com.au',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Sault News',
    domain: 'sooeveningnews.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Skimm',
    domain: 'theskimm.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Stanford Daily',
    domain: 'stanforddaily.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The State',
    domain: 'thestate.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The State Journal-Register',
    domain: 'sj-r.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The State Press (Arizona)',
    domain: 'statepress.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Sun Magazine',
    domain: 'thesunmagazine.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Sydney Morning Herald',
    domain: 'smh.com.au',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Tab',
    domain: 'thetab.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Trace',
    domain: 'thetrace.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Tyee',
    domain: 'thetyee.ca',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Varsity',
    domain: 'thevarsity.ca',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Verge',
    domain: 'theverge.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Virginian-Pilot',
    domain: 'pilotonline.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Week UK',
    domain: 'theweek.co.uk',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Wilderness Society',
    domain: 'wilderness.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Wire – India',
    domain: 'thewire.in',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'TheWrap',
    domain: 'thewrap.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Thibodaux Daily Comet',
    domain: 'dailycomet.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Thomasville Times-Enterprise',
    domain: 'timesenterprise.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Thompson Citizen',
    domain: 'thompsoncitizen.net',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Thomson Reuters Foundation',
    domain: 'news.trust.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'ThreeNow – TV3 – New Zealand',
    domain: 'threenow.co.nz',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Tifton Gazette',
    domain: 'tiftongazette.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Time Magazine',
    domain: 'time.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Times Headline',
    domain: 'timesheadline.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Times of Israel',
    domain: 'timesofisrael.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Times-Picayune',
    domain: 'nola.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Tofino-Ucluelet Westerly News',
    domain: 'westerlynews.ca',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Tomdispatch.com',
    domain: 'tomdispatch.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Topeka Capital-Journal',
    domain: 'cjonline.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Tri-City News',
    domain: 'tricitynews.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Truth Be Told',
    domain: 'truthbetold.news',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Tuscaloosa News',
    domain: 'tuscaloosanews.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'TVA Nouvelles',
    domain: 'tvanouvelles.ca',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Type Media Center',
    domain: 'typemediacenter.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'UAWire',
    domain: 'uawire.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Undark',
    domain: 'undark.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Union of Concerned Scientists',
    domain: 'ucsusa.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'United Federation of Teachers',
    domain: 'uft.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'United States Citizenship and Immigration Services',
    domain: 'uscis.gov',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'University Business',
    domain: 'universitybusiness.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'UN News',
    domain: 'news.un.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Ukrayinska Pravda (The Ukrainian Truth)',
    domain: 'pravda.com.ua',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Urban Institute',
    domain: 'urban.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'USA Today',
    domain: 'usatoday.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'UsNews and World Report',
    domain: 'usnews.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Utah Public Radio (UTR)',
    domain: 'upr.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Utica Observer-Dispatch',
    domain: 'uticaod.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'UVA – Center for Politics',
    domain: 'centerforpolitics.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Valdosta Daily Times',
    domain: 'valdostadailytimes.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Vancouver Island Free Daily',
    domain: 'vancouverislandfreedaily.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Vanderhoof Omineca Express',
    domain: 'ominecaexpress.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Vanguard News Nigeria',
    domain: 'vanguardngr.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Variety Magazine',
    domain: 'variety.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Ventura County Star',
    domain: 'vcstar.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Vera Files',
    domain: 'verafiles.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Vernon Morning Star',
    domain: 'vernonmorningstar.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Vibe',
    domain: 'vibe.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Vice News',
    domain: 'vice.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Victoria Advocate',
    domain: 'victoriaadvocate.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Victoria Buzz',
    domain: 'victoriabuzz.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Victoria News',
    domain: 'vicnews.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Victorville Daily Press',
    domain: 'vvdailypress.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Vineland Daily Journal',
    domain: 'thedailyjournal.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Virginia Mercury',
    domain: 'virginiamercury.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Visalia Times-Delta',
    domain: 'visaliatimesdelta.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'VladTV',
    domain: 'vladtv.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Voice of OC',
    domain: 'voiceofoc.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Voice of San Diego',
    domain: 'voiceofsandiego.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Vote Vets',
    domain: 'votevets.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'VTDigger',
    domain: 'vtdigger.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Vulture',
    domain: 'vulture.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WalesOnline',
    domain: 'walesonline.co.uk',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Walker Pilot-Independent',
    domain: 'walkermn.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WAMU-FM',
    domain: 'wamu.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Washington Blade',
    domain: 'washingtonblade.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Washington Monthly',
    domain: 'washingtonmonthly.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Washington Office on Latin America',
    domain: 'wola.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Washington Post',
    domain: 'washingtonpost.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WAPR – NPR – Selma',
    domain: 'apr.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Waterloo Chronicle',
    domain: 'waterloochronicle.ca',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WBBM – CBS Chicago',
    domain: 'chicago.cbslocal.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WBTS – NBC 10 – Boston',
    domain: 'nbcboston.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WCCO – CBS Minnesota',
    domain: 'minnesota.cbslocal.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Welland Tribune',
    domain: 'wellandtribune.ca',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'West Hawaii Today',
    domain: 'westhawaiitoday.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WFOR – CBS Miami',
    domain: 'miami.cbslocal.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WHDH – Boston News',
    domain: 'whdh.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WHYY – NPR – Philadelphia',
    domain: 'whyy.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Williams Lake Tribune',
    domain: 'wltribune.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Wilmington Star-News',
    domain: 'starnewsonline.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Wikileaks',
    domain: 'wikileaks.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WindsorNewsToday',
    domain: 'windsornewstoday.ca',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Wired Magazine',
    domain: 'wired.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WISH-TV',
    domain: 'wishtv.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WJAB – NPR – Huntsville',
    domain: 'wjab.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WJZ – CBS Baltimore',
    domain: 'baltimore.cbslocal.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WLRH – NPR – Huntsville',
    domain: 'wlrh.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WNYC',
    domain: 'wnyc.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Woodrow Wilson International Center',
    domain: 'wilsoncenter.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Wooster Daily Record –',
    domain: 'the-daily-record.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'World Policy Institute',
    domain: 'worldpolicy.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WorldCrunch',
    domain: 'worldcrunch.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'World Economic Forum',
    domain: 'weforum.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'World Press Review',
    domain: 'worldpress.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'World Resources Institute',
    domain: 'wri.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'World Wide Fund for Nature',
    domain: 'wwf.panda.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WPVI – Philadelphia -Action News',
    domain: '6abc.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WRC-TV',
    domain: 'nbcwashington.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WSVN',
    domain: 'wsvn.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WTOG – CBS Tampa',
    domain: 'tampa.cbslocal.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WTVJ – NBC 6 – Miami',
    domain: 'nbcmiami.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WUAL – NPR – Tuscaloosa',
    domain: 'wapr.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WUPA – CBS Atlanta',
    domain: 'atlanta.cbslocal.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WVAS – NPR – Montgomery',
    domain: 'wvasfm.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WWJ – CBS Detroit',
    domain: 'detroit.cbslocal.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Yahoo News',
    domain: 'news.yahoo.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'YnetNews',
    domain: 'ynetnews.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'York Daily Record',
    domain: 'ydr.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'York Dispatch',
    domain: 'yorkdispatch.com',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Youth Radio',
    domain: 'youthradio.org',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Zenger News',
    domain: 'zenger.news',
    bias_labels: [
      {
        label: 'center-left',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: '9News – KUSA',
    domain: '9news.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: '11 News – KKCO',
    domain: 'nbc11news.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: '12 News KPNX',
    domain: '12news.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: '13 News – WIBW',
    domain: 'wibw.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: '23WIFR News',
    domain: 'wifr.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: '24/7 Wall St.',
    domain: '247wallst.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: '38 North',
    domain: '38north.org',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: '1010 WINS AM',
    domain: '1010wins.radio.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: '1440 Newsletter',
    domain: 'join1440.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'ABC7 New York',
    domain: 'abc7ny.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'ABC12/WJRT-TV',
    domain: 'abc12.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'ABS-CBN',
    domain: 'news.abs-cbn.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Ad Fontes Media',
    domain: 'adfontesmedia.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Adrian Daily Telegram',
    domain: 'lenconnect.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Africa Check',
    domain: 'africacheck.org',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'AgDaily',
    domain: 'agdaily.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Agence France-Presse (AFP)',
    domain: 'afp.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Agerpres',
    domain: 'agerpres.ro',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'AgWeb',
    domain: 'agweb.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Ahwatukee Foothills News',
    domain: 'ahwatukee.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Airwars',
    domain: 'airwars.org',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Alabama Now',
    domain: 'alabamanow.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Alabama Political Reporter',
    domain: 'alreporter.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Albany Democrat-Herald',
    domain: 'democratherald.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Algemeen Dagblad',
    domain: 'ad.nl',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Alliance For Securing Democracy',
    domain: 'securingdemocracy.gmfus.org',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Alloa Advertiser',
    domain: 'alloaadvertiser.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Alpena News',
    domain: 'thealpenanews.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Amarillo Globe-News',
    domain: 'amarillo.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'America Max News',
    domain: 'americamaxnews.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'American Heritage',
    domain: 'americanheritage.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'American Press Institute (API)',
    domain: 'americanpressinstitute.org',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'AmoMama',
    domain: 'news.amomama.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Anchorage Daily News',
    domain: 'adn.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Anderson Independent Mail',
    domain: 'independentmail.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Andover Advertiser',
    domain: 'andoveradvertiser.co.uk',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Arc Digital',
    domain: 'arcdigital.media',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Ardrossan and Saltcoats Herald',
    domain: 'ardrossanherald.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Arenac County Independent',
    domain: 'arenacindendent.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Arirang',
    domain: 'arirang.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Ars Technica',
    domain: 'arstechnica.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Asheboro Courier-Tribune',
    domain: 'courier-tribune.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Asia Times',
    domain: 'atimes.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Aspen Times',
    domain: 'aspentimes.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Athens Messenger',
    domain: 'athensmessenger.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Atlas Obscura',
    domain: 'atlasobscura.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Auburn Citizen',
    domain: 'auburnpub.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Australian Associated Press (AAP)',
    domain: 'aap.com.au',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Avenue News',
    domain: 'avenuenews.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Ayr Advertiser',
    domain: 'ayradvertiser.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Babnet Tunisia',
    domain: 'babnet.net',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Ballot-Access News',
    domain: 'ballot-access.org',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Ballotpedia',
    domain: 'ballotpedia.org',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Barrhead News',
    domain: 'barrheadnews.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Barry and District News',
    domain: 'barryanddistrictnews.co.uk',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Basildon Echo',
    domain: 'echo-news.co.uk',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Basingstoke Gazette',
    domain: 'basingstokegazette.co.uk',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Beatrice Daily Sun',
    domain: 'beatricedailysun.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Belleville News-Democrat',
    domain: 'bnd.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Benzinga',
    domain: 'benzinga.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'BestLife',
    domain: 'bestlifeonline.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Better Government Association',
    domain: 'bettergov.org',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Bicester Advertiser',
    domain: 'bicesteradvertiser.net',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Big Country 99.5 – Tulsa',
    domain: 'bigcountry995.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Bigfork Eagle',
    domain: 'bigforkeagle.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Big News Network',
    domain: 'bignewsnetwork.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Big Think',
    domain: 'bigthink.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Binghamton Press & Sun Bulletin',
    domain: 'pressconnects.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Biography (A&E)',
    domain: 'biography.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Bismarck Tribune',
    domain: 'bismarcktribune.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'BlastingNews',
    domain: 'us.blastingnews.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Blueprint Newspaper',
    domain: 'blueprint.ng',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'BNO News',
    domain: 'bnonews.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Boca Post',
    domain: 'bocapost.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Bonner County Daily Bee',
    domain: 'bonnercountydailybee.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Bonners Ferry Herald',
    domain: 'bonnersferryherald.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Boonville Daily News',
    domain: 'boonvilledailynews.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Border Counties Advertizer',
    domain: 'bordercountyadvertizer.co.uk',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'BorderReport',
    domain: 'borderreport.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Border Telegraph',
    domain: 'bordertelegraph.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Borehamwood Times',
    domain: 'borehamwoodtimes.co.uk',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Bournemouth Daily Echo',
    domain: 'bournemouthecho.co.uk',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Bradenton Herald',
    domain: 'bradenton.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Bracknell News',
    domain: 'bracknellnews.co.uk',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Bradford Telegraph and Argus',
    domain: 'thetelegraphandargus.co.uk',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Braintree & Witham Times',
    domain: 'braintreeandwithamtimes.co.uk',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Brentwood Live',
    domain: 'brentwoodlive.co.uk',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Bridge Magazine',
    domain: 'bridgemi.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Bridgewater Mercury',
    domain: 'bridgewatermercury.co.uk',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Bridport and Lyme Regis News',
    domain: 'bridportnews.co.uk',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Bring Me The News',
    domain: 'bringmethenews.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Bristol Herald Courier',
    domain: 'heraldcourier.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Bromsgrove Advertiser',
    domain: 'bromsgroveadvertiser.co.uk',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Bryan-College Station Eagle',
    domain: 'theeagle.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Buck Free Press',
    domain: 'bucksfreepress.co.uk',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Buffalo Center Tribune',
    domain: 'thebuffalocentertribune.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Buffalo News',
    domain: 'buffalonews.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Bullshido',
    domain: 'bullshido.net',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Bureau County Republican',
    domain: 'shawlocal.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Burnham & Highbridge Weekly',
    domain: 'burnhamandhighbridgeweeklynews.co.uk',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Bury Times',
    domain: 'burytimes.co.uk',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Business2Community',
    domain: 'business2community.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Butler County Times-Gazette',
    domain: 'butlercountytimesgazette.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Butler County Tribune-Journal',
    domain: 'butlercountytribune.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'C-Span',
    domain: 'c-span.org',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Calmar Courier',
    domain: 'calmarcourier.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Canadian Public Affairs Channel (CPAC)',
    domain: 'cpac.ca',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Canon City Daily Record',
    domain: 'canoncitydailyrecord.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Cape Cod Times',
    domain: 'capecodtimes.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Cape Coral Breeze',
    domain: 'capecoralbreeze.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Capitol Fax',
    domain: 'capitolfax.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Carroll County News',
    domain: 'carrollconews.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Casper Star-Tribune',
    domain: 'trib.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Castanet',
    domain: 'castanet.net',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'CBS Philly',
    domain: 'philadelphia.cbslocal.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Center for Democracy and Technology',
    domain: 'cdt.org',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Center for Responsive Politics',
    domain: 'opensecrets.org',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Center for strategic and International studies',
    domain: 'csis.org',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Central Fife Times',
    domain: 'centralfifetimes.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Chandler Arizonan',
    domain: 'chandlernews.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Challis Register',
    domain: 'postregiser.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Channel News Asia – CNA',
    domain: 'channelnewsasia.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Chard & Ilminster News',
    domain: 'chardandilminsternews.co.uk',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Charity Navigator',
    domain: 'charitynavigator.org',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Chatham House',
    domain: 'chathamhouse.org',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Chattanooga Times Free Press',
    domain: 'timesfreepress.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Chelmsford Landmark',
    domain: 'thelandmark.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Chelmsford & Mid Essex Times',
    domain: 'chelmsfordweeklynews.co.uk',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Chester and District Standard',
    domain: 'chesterstandard.co.uk',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Chico Enterprise-Record',
    domain: 'chicoer.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Chillicothe Constitution-Tribune',
    domain: 'chillicothenews.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Chinook Observer',
    domain: 'chinookobserver.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Chippewa Herald',
    domain: 'chippewa.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Christian Science Monitor',
    domain: 'csmonitor.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Cinncinati Enquirer',
    domain: 'cincinnati.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'CityNews Calgary',
    domain: 'calgary.citynews.ca',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'CityNews Edmonton',
    domain: 'edmonton.citynews.ca',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'CityNews Halifax',
    domain: 'halifax.citynews.ca',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'CityNews Kitchener',
    domain: 'kitchener.citynews.ca',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'CityNews Montreal',
    domain: 'montreal.citynews.ca',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'CityNews Ottawa',
    domain: 'ottawa.citynews.ca',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'CityNews Toronto',
    domain: 'toronto.citynews.ca',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'CityNews Vancouver',
    domain: 'vancouver.citynews.ca',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'CityNews Winnipeg',
    domain: 'winnipeg.citynews.ca',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Clacton Gazette',
    domain: 'clactonandfrintongazette.co.uk',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Clarinda Herald-Journal',
    domain: 'clarindaherald.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Clark Fork Valley Press',
    domain: 'vp-mi.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Clay County Times-Democrat',
    domain: 'cctimesdemocrat.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Clay Today',
    domain: 'claytodayonline.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Clayton Record',
    domain: 'claytonrecord.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Clear Lake Mirror-Reporter',
    domain: 'clreporter.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Clydebank Post',
    domain: 'clydebankpost.co.uk',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Columbia Basin Herald',
    domain: 'columbiabasinherald.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Columbus Telegram',
    domain: 'columbustelegram.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'CNET',
    domain: 'cnet.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Coeur d’Alene Press',
    domain: 'cdapress.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Committee for Economic development',
    domain: 'ced.org',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Committee to Protect Journalists',
    domain: 'cpj.org',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Community Impact',
    domain: 'communityimpact.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Comparitech',
    domain: 'comparitech.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Concord Independent Tribune',
    domain: 'independenttribune.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Concord Monitor',
    domain: 'concordmonitor.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Congress.gov',
    domain: 'congress.gov',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Congressional Budget Office (CBO)',
    domain: 'cbo.gov',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Constitution Daily',
    domain: 'constitutioncenter.org',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Constitutional Rights Foundation',
    domain: 'crf-usa.org',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Consumer Reports',
    domain: 'consumerreports.org',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Cook County News-Herald',
    domain: 'cookcountynews-herald.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Cook Political Reports',
    domain: 'cookpolitical.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Cotswold Journal',
    domain: 'cotswoldjournal.co.uk',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Coriere della Sera',
    domain: 'corriere.it',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Corvallis Gazette-Times',
    domain: 'gazettetimes.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Council on Foreign Relations',
    domain: 'cfr.org',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Countable News',
    domain: 'countable.us',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Country Living',
    domain: 'countryliving.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Courthouse News Service',
    domain: 'courthousenews.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'CourtTV',
    domain: 'courttv.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Covid Tracking Project',
    domain: 'covidtracking.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'CP24',
    domain: 'cp24.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Craig Press',
    domain: 'craigdailypress.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Crain’s Cleveland Business',
    domain: 'crainscleveland.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Crains Detroit',
    domain: 'crainsdetroit.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Craven Herald & Pioneer',
    domain: 'cravenherald.co.uk',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Creston News Advertiser',
    domain: 'crestonnews.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Crookston Times',
    domain: 'crookstontimes.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Crux',
    domain: 'cruxnow.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'CTV News',
    domain: 'ctvnews.ca',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Culpeper Star-Exponent',
    domain: 'starexponent.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Cumnock Chronicle',
    domain: 'cumnockchronicle.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Cyberscoop',
    domain: 'cyberscoop.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'D.C. Circuit Breaker',
    domain: 'dccircuitbreaker.org',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Daily Business Review',
    domain: 'dailybusinessreview.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Daily Camera',
    domain: 'dailycamera.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Daily Freeman-Journal',
    domain: 'freemanjournal.net',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Daily Inter Lake',
    domain: 'dailyinterlake.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Daily Journal (Missouri)',
    domain: 'dailyjournalonline.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Daily Maverick',
    domain: 'dailymaverick.co.za',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Daily NK',
    domain: 'dailynk.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Daily Nonpareil',
    domain: 'nonpareilonline.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Daily Post Nigeria',
    domain: 'dailypost.ng',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Daily Record',
    domain: 'dailyrecord.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Danville Register & Bee',
    domain: 'godanriver.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Darien Times',
    domain: 'darientimes.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Dayton Daily News',
    domain: 'daytondailynews.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Defense News',
    domain: 'defensenews.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Defense One',
    domain: 'defenseone.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'DefenseScoop',
    domain: 'defensescoop.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Delaware County Daily Times',
    domain: 'delcotimes.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Delaware LIVE News',
    domain: 'delawarelive.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Denison Bulletin Review',
    domain: 'dbrnews.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Des Moines Register',
    domain: 'desmoinesregister.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'De Standaard',
    domain: 'standaard.be',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'DifferenceBetween.net',
    domain: 'differencebetween.net',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Digi24',
    domain: 'digi24.ro',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Digital Journal',
    domain: 'digitaljournal.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Dispatch-Argus',
    domain: 'qconline.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Divided We Fall',
    domain: 'dividedwefall.org',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'D Magazine',
    domain: 'dmagazine.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Doctors Without Borders',
    domain: 'doctorswithoutborders.org',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Dodge City Daily Globe',
    domain: 'dodgeglobe.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Dorset Echo',
    domain: 'dorsetecho.co.uk',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Dothan Eagle',
    domain: 'dothaneagle.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'DPA German Press Agency',
    domain: 'dpa-international.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'DT News',
    domain: 'ladowntownnews.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Dudley News',
    domain: 'dudleynews.co.uk',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Duluth News Tribune',
    domain: 'duluthnewstribune.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Dumbarton Reporter',
    domain: 'dumbartonreporter.co.uk',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Dunfermline Press',
    domain: 'dunfermlinepress.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Eagle Grove Eagle',
    domain: 'theeaglegroveeagle.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Ealing Times',
    domain: 'ealingtimes.co.uk',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'East County Observer',
    domain: 'yourobserver.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Eastern Daily Press',
    domain: 'edp24.co.uk',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'East Idaho News',
    domain: 'eastidahonews.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'East Lothian Courier',
    domain: 'eastlothiancourier.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'East London and West Essex Guardian',
    domain: 'guardian-series.co.uk',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'East Valley Tribune',
    domain: 'eastvalleytribune.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Eat This, Not That',
    domain: 'eatthis.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Eau Claire Leader-Telegram',
    domain: 'leadertelegram.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'EdScoop',
    domain: 'edscoop.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Eldora Herald-Ledger',
    domain: 'eldoranewspapers.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Elmira Star-Gazette',
    domain: 'stargazette.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'El Nuevo Dia',
    domain: 'elnuevodia.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Enfield Independent',
    domain: 'enfieldindependent.co.uk',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Englewood Sun',
    domain: 'yoursun.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Epping Forest Guardian',
    domain: 'eppingforestguardian.co.uk',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Erie Times-News',
    domain: 'goerie.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'ERR News (Estonia Public Broadcasting)',
    domain: 'news.err.ee',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Escanaba Daily Press',
    domain: 'dailypress.net',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Eurasia Group',
    domain: 'eurasiagroup.net',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Eureka Times-Standard',
    domain: 'times-standard.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Euro|Topics',
    domain: 'eurotopics.net',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Every CRS Report',
    domain: 'everycrsreport.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Fact Check',
    domain: 'factcheck.org',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Factwire News Agency',
    domain: 'factwire.org',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Fairmont Sentinel',
    domain: 'fairmontsentinel.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Fayetteville Observer',
    domain: 'fayobserver.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Federal News Network',
    domain: 'federalnewsnetwork.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Federal Times',
    domain: 'federaltimes.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'FedScoop',
    domain: 'fedscoop.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Financial Times',
    domain: 'ft.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'First Coast News',
    domain: 'firstcoastnews.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'First Draft News',
    domain: 'firstdraftnews.org',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Fitchburg Sentinel & Enterprise',
    domain: 'sentinelandenterprise.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Florida Politics',
    domain: 'floridapolitics.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Florida Times Union',
    domain: 'jacksonville.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Foreign Affairs',
    domain: 'foreignaffairs.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Foreign Policy',
    domain: 'foreignpolicy.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Fort Dodge Messenger',
    domain: 'messengernews.net',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Fort Leavenworth Lamp',
    domain: 'ftleavenworthlamp.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Fort Morgan Times',
    domain: 'fortmorgantimes.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Foster’s Daily Democrat',
    domain: 'fosters.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'France 24',
    domain: 'france24.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Franklin News-Post',
    domain: 'thefranklinnewspost.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Fredericksburg Free Lance Star',
    domain: 'fredericksburg.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Frederick News-Post',
    domain: 'fredericknewspost.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Fremont Tribune',
    domain: 'fremonttribune.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'FT Bragg Advocate-News',
    domain: 'advocate-news.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Full Fact UK',
    domain: 'fullfact.org',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Gallup',
    domain: 'gallup.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Gapminder',
    domain: 'gapminder.org',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Garden City Telegram',
    domain: 'gctelegram.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Garner Leader',
    domain: 'garnerleader.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Geek.com',
    domain: 'geek.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Geekwire',
    domain: 'geekwire.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Gilbert Sun News',
    domain: 'gilbertsunnews.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Gladbrook Sun-Courier',
    domain: 'sun-courier.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Gladstone Dispatch',
    domain: 'gladstonedispatch.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Glasgow Times',
    domain: 'glasgowtimes.co.uk',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Glendale Star',
    domain: 'glendalestar.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Glenwood Springs Post Independent',
    domain: 'postindependent.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Global Integrity',
    domain: 'globalintegrity.org',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Global Security',
    domain: 'globalsecurity.org',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Global Slavery Index',
    domain: 'globalslaveryindex.org',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Globe Gazette (Iowa)',
    domain: 'globegazette.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'GoodNewsNetwork',
    domain: 'goodnewsnetwork.org',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Government Accountability Office (GAO)',
    domain: 'gao.gov',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'GovTrack',
    domain: 'govtrack.us',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Granite Falls Advocate-Tribune',
    domain: 'granitefallsnews.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Grafton News',
    domain: 'thegraftonnews.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Grand Island Independent',
    domain: 'theindependent.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Gray DC Bureau',
    domain: 'graydc.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Great Falls Tribune',
    domain: 'greatfallstribune.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Green Bay Press-Gazette',
    domain: 'greenbaypressgazette.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Greenville News',
    domain: 'greenvilleonline.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Ground News',
    domain: 'ground.news',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Group of Thirty',
    domain: 'group30.org',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Grunion Gazette',
    domain: 'presstelegram.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Hacker News',
    domain: 'news.ycombinator.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Hazleton Standard-Speaker',
    domain: 'standardspeaker.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Hiawatha World',
    domain: 'hiawathaworldonline.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Hamburg Reporter',
    domain: 'hamburgreporter.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Hampton Chronicle',
    domain: 'hamptonchronicle.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Harvard Business Review',
    domain: 'hbr.org',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Harvard Gazette',
    domain: 'news.harvard.edu',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Hays Daily News',
    domain: 'hdnews.net',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Healthcare Finance News',
    domain: 'healthcarefinancenews.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Herald & Review',
    domain: 'herald-review.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Heritage Daily',
    domain: 'heritagedaily.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Hermosa Beach Daily Breeze',
    domain: 'dailybreeze.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Heterodox Academy',
    domain: 'heterodoxacademy.org',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Hickory Daily Record',
    domain: 'hickoryrecord.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Hillsboro Star-Journal',
    domain: 'starj.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Holstein Advance',
    domain: 'holsteinadvance.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Homeland Security News Wire',
    domain: 'homelandsecuritynewswire.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'How Stuff Works',
    domain: 'howstuffworks.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Hungry Horse News',
    domain: 'hungryhorsenews.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'I24 News',
    domain: 'i24news.tv',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Isa County Courier',
    domain: 'idacountycourier.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Idaho Falls Post Register',
    domain: 'postregister.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Idaho Statesman',
    domain: 'idahostatesman.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Inc. Magazine',
    domain: 'inc.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Independence Examiner',
    domain: 'examiner.net',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Independent Record (Montana)',
    domain: 'helenair.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Independent Voter Network (IVN)',
    domain: 'ivn.us',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'IndexMundi',
    domain: 'indexmundi.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Indianapolis Star',
    domain: 'indystar.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Inland Valley Bulletin',
    domain: 'dailybulletin.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Institute for Women’s Policy Research (IWPR)',
    domain: 'iwpr.org',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'International Consortium of Investigative Journalists',
    domain: 'icij.org',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'International Energy Agency',
    domain: 'iea.org',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'International Organization',
    domain: 'journals.cambridge.org',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'International Press Institute',
    domain: 'freemedia.at',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'International Rescue Committee',
    domain: 'rescue.org',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Investigative Reporters and Editors',
    domain: 'ire.org',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Investopedia',
    domain: 'investopedia.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Ipsos Polling',
    domain: 'ipsos.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Iron Mountain Daily News',
    domain: 'ironmountaindailynews.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Jacksonville Daily Record',
    domain: 'jaxdailyrecord.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Janes 360',
    domain: 'janes.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Japan Times',
    domain: 'japantimes.co.jp',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Jasper County Tribune',
    domain: 'newtondailynews.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'JD Supra',
    domain: 'jdsupra.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Jewish Telegraphic Agency (JTA)',
    domain: 'jta.org',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Journal Gazette',
    domain: 'journalgazette.net',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Justia',
    domain: 'justia.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Justice Denied',
    domain: 'justicedenied.org',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KAAL – Austin News',
    domain: 'kaaltv.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KABC – Los Angeles News',
    domain: 'abc7.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KADN – Lafayette News',
    domain: 'kadn.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KAGS – Bryan News',
    domain: 'kagstv.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KAIT8-TV',
    domain: 'kait8.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KALB – Central Louisiana News',
    domain: 'kalb.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KAMC – Lubbock News',
    domain: 'everythinglubbock.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KAMR – Amarillo News',
    domain: 'myhighplains.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KAPP – Yakima News',
    domain: 'yaktrinews.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KARD – West Monroe News',
    domain: 'myarklamiss.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KARE11',
    domain: 'kare11.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KARK – Little Rock News',
    domain: 'kark.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KATC – Lafayette News',
    domain: 'katc.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KATH – Juneau',
    domain: 'alaskasnewssource.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KAUZ – Wichita Falls News',
    domain: 'newschannel6now.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KAVU – Victoria News',
    domain: 'crossroadstoday.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KBJR – Duluth News',
    domain: 'kbjr6.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KBTX News 3',
    domain: 'kbtx.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KCAU – Sioux City News',
    domain: 'siouxlandproud.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KCBD – Lubbock News',
    domain: 'kcbd.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KCCI Des Moines',
    domain: 'kcci.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KCDO – Denver News',
    domain: 'thedenverchannel.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KCEN – Central Texas News',
    domain: 'kcentv.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KCGO – St. Joseph News',
    domain: 'newspressnow.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KCGR News',
    domain: 'kcgr.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KCPQ – Fox 13 – Tacoma',
    domain: 'q13fox.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KCRA 3',
    domain: 'kcra.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KCTV5',
    domain: 'kctv5.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KCWY – Casper News',
    domain: 'wyomingnewsnow.tv',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KDAF – CW33',
    domain: 'cw33.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KDBC – El Paso News',
    domain: 'cbs4local.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KDFW – Fox 4 – Dallas-Fort Worth',
    domain: 'fox4news.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KDRV – Medford News',
    domain: 'kdrv.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KDVR-TV',
    domain: 'kdvr.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Kearney Hub',
    domain: 'kearneyhub.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KELO – Sioux Falls News',
    domain: 'keloland.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KENS – San Antonio News',
    domain: 'kens5.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KERO TV – 23ABC',
    domain: 'turnto23.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KESQ – Palm Springs News',
    domain: 'kesq.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KETK – Jacksonville News',
    domain: 'ketk.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KETV',
    domain: 'ketv.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KEVN – Rapid City News',
    domain: 'blackhillsfox.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KEYC – Mantako News',
    domain: 'keyc.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KEYE – Austin News',
    domain: 'cbsaustin.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KEYT – Santa Barbara News',
    domain: 'keyt.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Key West Citizen',
    domain: 'keysnews.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KEZI – Eugene News',
    domain: 'kezi.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KFBB – Great Falls News',
    domain: 'nonstoplocal.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KFDA – Amarillo News',
    domain: 'newschannel10.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KFDX – Wichita Falls News',
    domain: 'texomashomepage.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KFMB – San Diego News',
    domain: 'cbs8.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KFQX – Grand Junction News',
    domain: 'westernslopenow.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KFSM – Fort Smith – Fayetteville News',
    domain: '5newsonline.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KFTA – Northwest Arkansas News',
    domain: 'nwahomepage.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KFVS – Cape Girardeau News',
    domain: 'kfvs12.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KFYR – Bismarck News',
    domain: 'kfyrtv.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KGET – Bakersfield News',
    domain: 'kget.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KGMB – Hawaii News Now',
    domain: 'hawaiinewsnow.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KGNS News',
    domain: 'kgns.tv',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KGPE – Fresno News',
    domain: 'yourcentralvalley.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KGTV – San Diego News',
    domain: '10news.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KGUN – Tucson News',
    domain: 'kgun9.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KGW – Portland News',
    domain: 'kgw.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KHBS/KHOG – Fort Smith News',
    domain: '4029tv.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'K-Hits 106.9 – Tulsa',
    domain: 'khits.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KHMT – Hardin News',
    domain: 'yourbigsky.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KHON – Honolulu News',
    domain: 'khon2.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KHOU – Houston News',
    domain: 'khou.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KHSL – Chico News',
    domain: 'actionnewsnow.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KIAH – CW39',
    domain: 'cw39.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KIDY – Fox West Texas',
    domain: 'myfoxzone.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KIEM – Redwood News',
    domain: 'kiem-tv.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KIFI – Idaho Falls',
    domain: 'localnews8.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KIII –  Corpus Christi News',
    domain: 'kiiitv.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KIIT – North Platte News',
    domain: 'knopnews2.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KIMT – Mason City News',
    domain: 'kimt.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KING – Seattle News',
    domain: 'king5.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Kingston Daily Freeman',
    domain: 'dailyfreeman.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KION – Monterey News',
    domain: 'kion456.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Kiowa County Signal',
    domain: 'kiowacountysignal.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Kiplinger',
    domain: 'kiplinger.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KIRO 7',
    domain: 'kiro7.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KITV',
    domain: 'kitv.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KIVI – Boise News',
    domain: 'kivitv.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KJCT – Grand Junction News',
    domain: 'kjct8.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KJRH – Tulsa News',
    domain: 'kjrh.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KJTL – Wichita Falls',
    domain: 'texashomepage.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KKTV 11 News',
    domain: 'kktv.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KLAS – Las Vegas News',
    domain: '8newsnow.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KLAX – Alexandria News',
    domain: 'klax-tv.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KLFY – Lafayette News',
    domain: 'klfy.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KLJB – Quad Cities News',
    domain: 'ourquadcities.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KLRT – Little Rock News',
    domain: 'fox16.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KLTV – Tyler News',
    domain: 'kltv.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KMBC – Kansas City News',
    domain: 'kmbc.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KMID – Midland News',
    domain: 'yourbasin.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KMIZ – Columbia News',
    domain: 'abc17news.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KMOV',
    domain: 'kmov.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KNEP – Scottsbluff News',
    domain: 'nbcnebraskascottsbluff.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KMTV – Omaha News',
    domain: '3newsnow.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KMVT – Twin Fall News',
    domain: 'kmvt.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KNOE – Monroe News',
    domain: 'knoe.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KNPL – North Platte News',
    domain: '1011np.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Know Your Meme',
    domain: 'knowyourmeme.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Knowhere',
    domain: 'knowherenews.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Knoxville News Senitinel',
    domain: 'knoxnews.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KNXV – Phoenix News',
    domain: 'abc15.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KOAA – News5 – Pueblo',
    domain: 'koaa.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KOAM News Now',
    domain: 'koamnewsnow.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KOAT – Albuquerque News',
    domain: 'koat.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KOB 4 Eyewitness News',
    domain: 'kob.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KODE – Joplin News',
    domain: 'fourstateshomepage.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KOIN – Portland',
    domain: 'koin.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KOKI Fox23 – Tulsa',
    domain: 'fox23.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KOLD News 13',
    domain: 'kold.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KOLN/KGIN – Lincoln News',
    domain: '1011now.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KOLO 8 News Now',
    domain: 'kolotv.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KOLR – Springfield News',
    domain: 'ozarksfirst.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KOSA – CBS7',
    domain: 'cbs7.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KOTA – Rapid City News',
    domain: 'kotatv.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KOTV – Newson6',
    domain: 'newson6.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KPAX – Missoula News',
    domain: 'kpax.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KRIS 6 News – Corpus Christi',
    domain: 'kristv.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KPLC – Lake Charles News',
    domain: 'kplctv.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KPTV – Portland News',
    domain: 'kptv.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KPVI – Idaho Falls News',
    domain: 'kpvi.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KRBC – Abilene News',
    domain: 'bigcountryhomepage.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KRDO – Colorado Springs News',
    domain: 'krdo.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KREM – Spokane News',
    domain: 'krem.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KRIV – Fox 26 – Houston',
    domain: 'fox26houston.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KRON 4',
    domain: 'kron4.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KRQE – Albuquerque',
    domain: 'krqe.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KRTV – Great Falls News',
    domain: 'krtv.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KSAT – San Antonio News',
    domain: 'ksat.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KSAZ – Fox 10 Phoenix',
    domain: 'fox10phoenix.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KSBW – Monterey News',
    domain: 'ksbw.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KSEE – Fresno News',
    domain: 'yourcentralvelley.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KSFY – Sioux Falls News',
    domain: 'dakotanewsnow.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KSHB – Kansas City News',
    domain: 'kshb.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KSL-TV',
    domain: 'ksl.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KSLA – Shreveport News',
    domain: 'ksla.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KSNB Channel 4',
    domain: 'ksnblocal4.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KSNT – Topeka News',
    domain: 'ksnt.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KSNW – Wichita News',
    domain: 'ksn.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KSPR',
    domain: 'ky3.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KSTP-TV',
    domain: 'kstp.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KSTU – Salt Lake City News',
    domain: 'fox13now.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KSWB – Fox5 – San Diego',
    domain: 'fox5sandiego.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KSWO – Lawton News',
    domain: 'kswo.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KTAL – Shreveport News',
    domain: 'arklatexhomepage.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KTBC – Fox 7 – Austin',
    domain: 'fox7austin.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KTBS – Shreveport News',
    domain: 'ktbs.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KTFT – Twin Falls News',
    domain: 'ktvb.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KTIV – Sioux City News',
    domain: 'ktiv.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KTLA',
    domain: 'ktla.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KTNV – Las Vegas News',
    domain: 'ktnv.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KTRE – Lufkin News',
    domain: 'ktre.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KTSM – El Paso News',
    domain: 'ktsm.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KTTC – Rochester News',
    domain: 'kttc.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KTTV – Fox 11 – Los Angeles',
    domain: 'foxla.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KTUU-TV',
    domain: 'ktuu.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KTVA 11',
    domain: 'ktva.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KTVF – Fairbanks News',
    domain: 'webcenterfairbanks.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KTVH – Helena News',
    domain: 'ktvh.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KTVI – St. Louis',
    domain: 'fox2now.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KTVQ – Billings News',
    domain: 'ktvq.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KTVU Fox 2',
    domain: 'ktvu.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KTVX – Salt Lake City News',
    domain: 'abc4.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KTXL Sacramento News',
    domain: 'fox40.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KVEO – Rio Grande Valley News',
    domain: 'valleycentral.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KVIA – El Paso News',
    domain: 'kvia.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KVOA – Tucson News',
    domain: 'kvoa.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KVUE – Austin News',
    domain: 'kvue.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KVVU – Las Vegas News',
    domain: 'fox5vegas.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KWCH – Wichita News',
    domain: 'kwch.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KWES – Midland News',
    domain: 'newswest9.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KWKT – Waco News',
    domain: 'fox44news.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KWQC News',
    domain: 'kwqc.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KWTV-News9',
    domain: 'news9.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KWTX – Waco News',
    domain: 'kwtx.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KWWL – Waterloo News',
    domain: 'kwwl.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KXAN – Austin News',
    domain: 'kxan.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KXII News12',
    domain: 'kxii.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KXLF – Butte News',
    domain: 'kxlf.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KXLH – Helena News',
    domain: 'kxlh.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KXLY – Spokane News',
    domain: 'kxly.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KXMA – Dickinson News',
    domain: 'kxnet.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KXRM – Colorado Springs News',
    domain: 'fox21news.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KXTV – Sacramento News',
    domain: 'abc10.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KXXV – Waco News',
    domain: 'kxxv.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KYMA – Yuma',
    domain: 'kyma.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Kyodo News Plus',
    domain: 'english.kyodonews.net',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KYOU – Ottumwa News',
    domain: 'kyoutv.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KYTX – Nacogdoches News',
    domain: 'cbs19.tv',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'La Crosse Tribune',
    domain: 'lacrossetribune.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'La Devoir',
    domain: 'ledevoir.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Lahaina News',
    domain: 'lahainanews.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Lake City Graphic-Advocate',
    domain: 'thegraphic-advocate.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Lake County Leader',
    domain: 'leaderadvertiser.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Lake County Press',
    domain: 'lakecountypress.news',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Lake County Record-Bee',
    domain: 'record-bee.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Lake Geneva Regional News',
    domain: 'lakegenevanews.net',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'La Libre',
    domain: 'lalibre.be',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Lancashire Telegraph',
    domain: 'lancashiretelegraph.co.uk',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Lansdale Reporter',
    domain: 'thereporteronline.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Lansing State Journal',
    domain: 'lansingstatejournal.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Law.com',
    domain: 'law.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Law360',
    domain: 'law360.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Lawfare Blog',
    domain: 'lawfareblog.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Lawrence Journal-World',
    domain: 'ljworld.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Lead Stories',
    domain: 'leadstories.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Leavenworth Times',
    domain: 'leavenworthtimes.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Lebanon Daily News',
    domain: 'ldnews.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Lebanon-Express',
    domain: 'lebanon-express.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Le Droit',
    domain: 'ledroit.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Leominster Champion',
    domain: 'leominsterchamp.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Le Soir',
    domain: 'lesoir.be',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Lexington Herald-Clipper',
    domain: 'lexch.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Libby Western News',
    domain: 'thewesternnews.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Lifewire',
    domain: 'lifewire.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Lincoln Journal Star',
    domain: 'journalstar.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Linn County Leader',
    domain: 'linncountyleader.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Lithuanian National Radio and Television (LRT)',
    domain: 'lrt.lt',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Live Universal Awareness Map',
    domain: 'liveuamap.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'LNP – LancasterOnline',
    domain: 'lancasteronline.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Logically',
    domain: 'logically.ai',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Lompoc Record',
    domain: 'lompocrecord.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Longmont Times-Call',
    domain: 'timescall.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Lorain Morning Journal',
    domain: 'morningjournal.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Loveland Reporter-Herald',
    domain: 'reporterherald.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Lovely County Citizen',
    domain: 'lovelycitizen.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Lowell Sun',
    domain: 'lowellsun.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Lynchburg News and Advance',
    domain: 'newsadvance.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Macomb Daily',
    domain: 'macombdaily.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Macrotrends',
    domain: 'macrotrends.net',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Madrid Register-News',
    domain: 'madridregisternews.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'MakeUseOf',
    domain: 'makeuseof.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Maple Ridge-Pitt Meadows News',
    domain: 'mapleridgenews.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Marana News',
    domain: 'tucsonlocalmedia.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Marin Independent Journal',
    domain: 'marinij.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Marion County Record',
    domain: 'marionrecord.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'MarketBeat',
    domain: 'marketbeat.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Marshall Democrat-News',
    domain: 'marshallnews.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Marshall Mountain Wave',
    domain: 'emountainwave.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Marshalltown Times-Republican',
    domain: 'timesrepublican.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Martinsville Bulletin',
    domain: 'martinsvillebulletin.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'McDowell News',
    domain: 'mcdowellnews.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'McPherson Sentinel',
    domain: 'mcphersonsentinel.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'MediaPost',
    domain: 'mediapost.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Memeorandum',
    domain: 'memeorandum.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Memphis Commercial Appeal',
    domain: 'commercialappeal.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Mendocino Beacon',
    domain: 'mendocinobeacon.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Mental Floss',
    domain: 'mentalfloss.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Meriden Record-Journal',
    domain: 'myrecordjournal.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Merion West',
    domain: 'merionwest.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Mesa Tribune',
    domain: 'themesatribune.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'MetroWest Daily News',
    domain: 'metrowestdailynews.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'NewsNation',
    domain: 'newsnationnow.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Miami County Republic',
    domain: 'republic-online.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Military.com',
    domain: 'military.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Military Times',
    domain: 'militarytimes.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Millbury-Sutton Chronicle',
    domain: 'millburysutton.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Mint Newspaper',
    domain: 'livemint.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Missoulian',
    domain: 'missoulian.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Modern Healthcare',
    domain: 'modernhealthcare.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Monona Outlook',
    domain: 'outlooknewspaper.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Monroe News',
    domain: 'monroenews.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Monroe News Star',
    domain: 'thenewsstar.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Montana Standard',
    domain: 'mtstandard.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Montevideo American News',
    domain: 'montenews.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Mooresville Tribune',
    domain: 'mooresvilletribune.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Morganton News Herald',
    domain: 'morganton.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Morning Consult',
    domain: 'morningconsult.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Mountaineer Echo',
    domain: 'flippinonline.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Mount Pleasant Morning Sun',
    domain: 'themorningsun.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Münchner Merkur',
    domain: 'merkur.de',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Munising Beacon',
    domain: 'munisingbeacon.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Muscatine Journal',
    domain: 'muscatinejournal.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Napa Valley Register',
    domain: 'napavalleyregister.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'National Bureau of Economic Research',
    domain: 'nber.org',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'National Institute on Money in State Politics',
    domain: 'followthemoney.org',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'National Journal',
    domain: 'nationaljournal.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'NationMaster',
    domain: 'nationmaster.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Navy Times',
    domain: 'navytimes.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Nebraska City News-Press',
    domain: 'ncnewspress.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Need2Know',
    domain: 'theneed2know.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Newark Post',
    domain: 'newarkpostonline.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'New England Cable News (NECN)',
    domain: 'necn.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'NewFolks',
    domain: 'newfolks.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'New Zealand Herald',
    domain: 'nzherald.co.nz',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'News and News',
    domain: 'newsandnews.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'News Channel 4 (KFOR.com)',
    domain: 'kfor.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'News Facts Network (NFN)',
    domain: 'newsfactsnetwork.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'News Lookup',
    domain: 'newslookup.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'News24 (South Africa)',
    domain: 'news24.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Newsela',
    domain: 'newsela.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Newsguard',
    domain: 'newsguardtech.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'NewsNow UK',
    domain: 'newsnow.co.uk',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'News Straits Times',
    domain: 'nst.com.my',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'New Ulm Journal',
    domain: 'nujournal.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'NextGOV',
    domain: 'nextgov.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'NK News',
    domain: 'nknews.org',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'No Labels',
    domain: 'nolabels.org',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Noozhawk',
    domain: 'noozhawk.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Norristown Times-Herald',
    domain: 'timesherald.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'North Korea Times',
    domain: 'northkoreatimes.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'North Platte Telegraph',
    domain: 'nptelegraph.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'North Tama Telegraph',
    domain: 'northtamatelegraph.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Northwest Florida Daily News',
    domain: 'nwfdailynews.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Northwest Indiana Times',
    domain: 'nwitimes.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Novinite',
    domain: 'novinite.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Oakland Press',
    domain: 'theoaklandpress.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Ogden Reporter',
    domain: 'ogdenreporter.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Ogemaw County Herald',
    domain: 'ogemawherald.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'On The Issues',
    domain: 'ontheissues.org',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Opelika Auburn News',
    domain: 'oanews.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'OpenMind Magazine',
    domain: 'openmindmag.org',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Oregonian',
    domain: 'oregonlive.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Ormond Beach Observer',
    domain: 'ormondbeachobserver.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Oroville Mercury-Register',
    domain: 'orovillemr.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Osceola Sentinel-Tribune',
    domain: 'osceolaiowa.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Oscoda County Herald',
    domain: 'oscodaherald.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Ottawa Herald',
    domain: 'ottawaherald.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Oxford Mail',
    domain: 'oxfordmail.co.uk',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Oyez Project',
    domain: 'oyez.org',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Pacific Daily News',
    domain: 'guampdn.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'PA Media',
    domain: 'pa.media',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Parkersburg Eclipse News-Review',
    domain: 'parkersburgeclipse.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Park Record',
    domain: 'parkrecord.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Pasadena Star-News',
    domain: 'pasadenastarnews.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Patch',
    domain: 'patch.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Patheos',
    domain: 'patheos.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Peabody Gazette-Bulletin',
    domain: 'peabodykansas.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Pensacola News Journal',
    domain: 'pnj.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Peoria Journal Star',
    domain: 'pjstar.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Peoria Times',
    domain: 'peoriatimes.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Peterson Foundation',
    domain: 'pgpf.org',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Peterson Institute for International Economics',
    domain: 'piie.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Pew Research',
    domain: 'pewresearch.org',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Places Journal',
    domain: 'placesjournal.org',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Plus Maths',
    domain: 'plus.maths.org',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Pocahontas Star Herald',
    domain: 'starheraldnews.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Pocono Record',
    domain: 'poconorecord.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Political Wire',
    domain: 'politicalwire.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'PoliticsHome',
    domain: 'politicshome.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Polygraph.info',
    domain: 'polygraph.info',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Ponte Vedra Recorder',
    domain: 'pontevedrarecorder.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Postville Herald',
    domain: 'postvilleherald.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Pottstown Mercury',
    domain: 'pottmerc.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Pottsville Republican-Herald',
    domain: 'republicanherald.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Powys County Times',
    domain: 'countytimes.co.uk',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Poynter Institute',
    domain: 'poynter.org',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'PR Newswire',
    domain: 'prnewswire.mediaroom.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Pratt Tribune',
    domain: 'pratttribune.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Press of Atlantic City',
    domain: 'pressofatlanticcity.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'PressReader',
    domain: 'pressreader.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Procon.org',
    domain: 'procon.org',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Public Policy Polling',
    domain: 'publicpolicypolling.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Public Religion Research Institute',
    domain: 'prri.org',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Punchbowl News',
    domain: 'punchbowl.news',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Quad City Times',
    domain: 'qctimes.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Queen Creek Tribune',
    domain: 'queencreektribune.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Racine Journal Times',
    domain: 'journaltimes.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Radio Free Europe / Radio Liberty',
    domain: 'rferl.org',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Rainy Lake Gazette',
    domain: 'rainylakegazette.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Rand Corporation',
    domain: 'rand.org',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Ranker',
    domain: 'ranker.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Rapid City Journal',
    domain: 'rapidcityjournal.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Ravalli Republic',
    domain: 'ravallirepublic.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Record Searchlight',
    domain: 'redding.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Red Bluff Daily News',
    domain: 'redbluffdailynews.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Redlands Daily Facts',
    domain: 'redlandsdailyfacts.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Redwood Falls Gazette',
    domain: 'redwoodfallsgazette.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Reporter Without Borders',
    domain: 'rsf.org',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Reporters Lab',
    domain: 'reporterslab.org',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Repustar',
    domain: 'repustar.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Reuters',
    domain: 'reuters.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Rexburg Standard Journal',
    domain: 'rexburgstandardjournal.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'RFI – Radio France Internationale',
    domain: 'rfi.fr',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Riverdale Press',
    domain: 'riverdalepress.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'RNZ (Radio New Zealand)',
    domain: 'rnz.co.nz',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'RocaNews',
    domain: 'rocanews.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Roll Call',
    domain: 'rollcall.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'RTE (Radio Television of Ireland)',
    domain: 'rte.ie',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Ruidoso News',
    domain: 'ruidosonews.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'RumorGuard',
    domain: 'rumorguard.org',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Russia Matters',
    domain: 'russiamatters.org',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'San Diego Union Tribune',
    domain: 'sandiegouniontribune.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'San Gabriel Valley Tribune',
    domain: 'sgvtribune.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KSBY – San Luis Obispo News',
    domain: 'ksby.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'San Marcos Daily Record',
    domain: 'sanmarcosrecord.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Santa Cruz Sentinel',
    domain: 'santacruzsentinel.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Santa Maria Times',
    domain: 'santamariatimes.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'SanTan Sun News',
    domain: 'santansun.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Sarasota Herald-Tribune',
    domain: 'heraldtribune.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Sayfie Review',
    domain: 'sayfiereview.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Science Debate',
    domain: 'sciencedebate.org',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Scoopnest',
    domain: 'scoopnest.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Scottsbluff Star-Herald',
    domain: 'starherald.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Scottsdale Airpark News',
    domain: 'scottdaleairpark.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Scottsdale Progress',
    domain: 'scottsdale.org',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'SCOTUSblog',
    domain: 'scotusblog.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Scranton Times-Tribune',
    domain: 'thetimes-tribune.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Semafor',
    domain: 'semafor.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Shareably',
    domain: 'shareably.net',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Shenandoah Valley News',
    domain: 'valleynewstoday.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Shorenstein Center',
    domain: 'shorensteincenter.org',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Shoshone News-Press',
    domain: 'shoshonenewspress.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Shreveport Times',
    domain: 'shreveporttimes.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Sierra Sun',
    domain: 'sierrasun.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Sigourney News-Review',
    domain: 'sigourneynewsreview.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Simple Politics',
    domain: 'simplepolitics.co.uk',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Sioux City Journal',
    domain: 'siouxcityjournal.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Ski-Hi News',
    domain: 'skyhinews.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Sky News',
    domain: 'news.sky.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Sleepy Eye Herald-Dispatch',
    domain: 'sleepyeyenews.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'SmartNews',
    domain: 'smartnews.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Social Media Today',
    domain: 'socialmediatoday.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Southern Daily Echo',
    domain: 'dailyecho.co.uk',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'South Florida Sun-Sentinel',
    domain: 'sun-sentinel.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'South Missourian News',
    domain: 'southmissouriannews.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'South Wales Argus',
    domain: 'southwalesargus.co.uk',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Southwest Orange Observer',
    domain: 'orangeobserver.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Spectrum Local News',
    domain: 'spectrumlocalnews.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Spectrum News – NY1',
    domain: 'ny1.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Springfield News-Sun',
    domain: 'springfieldnewssun.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Spotlight PA',
    domain: 'spotlightpa.org',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Stacker',
    domain: 'stacker.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'St. Cloud Times',
    domain: 'sctimes.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'St. James Plaindealer',
    domain: 'stjamesnews.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Stars and Stripes',
    domain: 'stripes.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Staten Island Advance',
    domain: 'silive.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'StateScoop',
    domain: 'statescoop.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Statesman Journal',
    domain: 'statesmanjournal.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Steamboat Pilot & Today',
    domain: 'steamboatpilot.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Sterling Journal-Advocate',
    domain: 'journal-advocate.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Stimson Center',
    domain: 'stimson.org',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'St. John News',
    domain: 'sjnewsonline.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'StrategyPage',
    domain: 'strategypage.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Stratfor',
    domain: 'stratfor.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Study Finds',
    domain: 'studyfinds.org',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Summit Daily News',
    domain: 'summitdaily.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'SWVA Today',
    domain: 'swvatoday.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Tagesschau',
    domain: 'tagesschau.de',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Tahoe Daily Tribune',
    domain: 'tahoedailytribune.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Tama-Toledo News Chronicle',
    domain: 'tamatoledonews.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'TechSpot',
    domain: 'techspot.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Tempe Foothills Focus',
    domain: 'thefoothillsfocus.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Texas Standard',
    domain: 'texasstandard.org',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Teton Valley News',
    domain: 'tetonvalleynews.net',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'That’s Nonsense',
    domain: 'thatsnonsense.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Angle',
    domain: 'theangle.digitaltrends.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Argonaut',
    domain: 'argonautnews.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Australian Financial Review',
    domain: 'afr.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Balance',
    domain: 'thebalance.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Canadian Press',
    domain: 'thecanadianpress.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Centre for Economic Policy Research',
    domain: 'cepr.org',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Cipher Brief',
    domain: 'thecipherbrief.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Columbian',
    domain: 'columbian.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Conversation',
    domain: 'theconversation.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Daily Chronicle',
    domain: 'daily-chronicle.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Daily Gazette',
    domain: 'dailygazette.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Daily News (Longview)',
    domain: 'tdn.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Daily Northwestern',
    domain: 'dailynorthwestern.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Daily Progress',
    domain: 'dailyprogress.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Debrief',
    domain: 'thedebrief.org',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Defcon Warning System',
    domain: 'defconwarningsystem.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Diplomat Magazine',
    domain: 'thediplomat.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Drive 92.9 – Tulsa',
    domain: '929thedrive.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Economist',
    domain: 'economist.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Fence Post',
    domain: 'thefencepost.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Flip Side',
    domain: 'theflipside.io',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Herald-Sun (Durham, North Carolina)',
    domain: 'heraldsun.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Hill',
    domain: 'thehill.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Jamestown Foundation',
    domain: 'jamestown.org',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Jordan Times',
    domain: 'jordantimes.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Journal (Colorado)',
    domain: 'the-journal.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Journal Standard',
    domain: 'journalstandard.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Macon Telegraph',
    domain: 'macon.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Manual',
    domain: 'themanual.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Marietta Times',
    domain: 'mariettatimes.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Marshall Project',
    domain: 'themarshallproject.org',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Meme Policeman',
    domain: 'memepoliceman.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Mining Journal',
    domain: 'miningjournal.net',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Modesto Bee',
    domain: 'modbee.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Morning Call',
    domain: 'mcall.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Morning News',
    domain: 'scnow.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Nevada Independent',
    domain: 'thenevadaindependent.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Newton Kansan',
    domain: 'thekansan.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The News (Mexico City)',
    domain: 'thenews.mx',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The News Literacy Project',
    domain: 'thenewsliteracyproject.org',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The News Virginian',
    domain: 'newsvirginian.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Northern Echo',
    domain: 'thenorthernecho.co.uk',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Outlook (Monmouth University)',
    domain: 'outlook.monmouth.edu',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Post and Courier',
    domain: 'postandcourier.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Post Star',
    domain: 'poststar.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Post-Standard (Syracuse)',
    domain: 'syracuse.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Primary Market',
    domain: 'theprimarymarket.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Record – Stockton',
    domain: 'recordnet.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Republic (Indiana)',
    domain: 'therepublic.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Republican (Masslive)',
    domain: 'masslive.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Saratogian',
    domain: 'saratogian.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Salinas Californian',
    domain: 'thecalifornian.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Scotsman',
    domain: 'scotsman.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Sentinel (Pennsylvania)',
    domain: 'cumberlink.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Smoking Gun',
    domain: 'thesmokinggun.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Sociable',
    domain: 'sociable.co',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Southern Illinoisan',
    domain: 'thesouthern.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Strategy Bridge',
    domain: 'thestrategybridge.org',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Tennessean',
    domain: 'tennessean.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Times and Democrat',
    domain: 'thetandd.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Town Talk',
    domain: 'thetowntalk.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Trentonian',
    domain: 'trentonian.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Union (Nevada County)',
    domain: 'theunion.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Vindicator',
    domain: 'vindy.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Waterloo-Cedar Falls Courier',
    domain: 'wcfcourier.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The ZDF (Zweites Deutsches Fernsehen)',
    domain: 'zdf.de',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Third Way',
    domain: 'thirdway.org',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'ThoughtCo',
    domain: 'thoughtco.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'THV11 – Little Rock News',
    domain: 'thv11.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Times of Malta',
    domain: 'timesofmalta.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Times of San Diego',
    domain: 'timesofsandiego.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Times-News (Idaho)',
    domain: 'magicvalley.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Today I Found Out',
    domain: 'todayifoundout.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Tonganoxie Mirror',
    domain: 'tonganoxiemirror.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Transparency International',
    domain: 'transparency.org',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Transpartisan Review',
    domain: 'transpartisanreview.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Tribune Content Agency',
    domain: 'tribunecontentagency.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Tri-City Herald',
    domain: 'tri-cityherald.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Tri-County News',
    domain: 'tricountynewsmn.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Troy Record',
    domain: 'troyrecord.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'TruthorFiction.com',
    domain: 'truthorfiction.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Tucson Weekly',
    domain: 'tucsonweekly.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'TVW Washington State',
    domain: 'tvw.org',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Twiner-Herald',
    domain: 'loganwoodbine.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Ukiah Daily Journal',
    domain: 'ukiahdailyjournal.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'United Press International (UPI)',
    domain: 'upi.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'United State House of Representatives',
    domain: 'house.gov',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'United States Courts',
    domain: 'uscourts.gov',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'USA Spending',
    domain: 'usaspending.gov',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'USAFacts',
    domain: 'usafacts.org',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'U.S. Press Freedom Tracker',
    domain: 'pressfreedomtracker.us',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Utah Standard-Examiner',
    domain: 'standard.net',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Vail Daily',
    domain: 'vaildaily.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Vallejo Times-Herald',
    domain: 'timesheraldonline.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Ventura County Reporter',
    domain: 'vcreporter.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Verdict',
    domain: 'verdict.justia.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'VERIFY Fact Check',
    domain: 'verifythis.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'VOA Chinese',
    domain: 'voachinese.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Voice of America',
    domain: 'voanews.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Vos Iz Neias',
    domain: 'vosizneias.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Vote Smart',
    domain: 'votesmart.org',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WAAY – Huntsville News',
    domain: 'waaytv.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WABG – DeltaNews',
    domain: 'deltanews.tv',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WABI – Bangor News',
    domain: 'wabi.tv',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WAFB – Baton Rouge',
    domain: 'wafb.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WAFF – Huntsville',
    domain: 'waff.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WAGA – Fox 5- Atlanta',
    domain: 'fox5atlanta.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WAGM – Maine News',
    domain: 'wagmtv.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Wahoo Newspaper',
    domain: 'wahoo-ashland-waverly.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WALA – Mobile News',
    domain: 'fox10tv.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WALB – Albany GA',
    domain: 'walb.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WAND – Decatur News',
    domain: 'wandtv.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WANE – Fort Wayne News',
    domain: 'wane.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WAOW – Wausau News',
    domain: 'waow.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WAPT – Jackson News',
    domain: 'wapt.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'War on the Rocks',
    domain: 'warontherocks.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Washington’s Top News (WTOP)',
    domain: 'wtop.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WATE – Knoxville News',
    domain: 'wate.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WATN – Memphis News',
    domain: 'localmemphis.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WAVE – Louisville News',
    domain: 'wave3.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WAVY – Norfolk News',
    domain: 'wavy.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WAWV – Terre Haute News',
    domain: 'mywabasjvalley.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WBAL – Baltimore News',
    domain: 'wbaltv.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WBAY Action 2 News',
    domain: 'wbay.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WBGH – Binghamton News',
    domain: 'binghamtonhomepage.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WBIR – Knoxville News',
    domain: 'wbir.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WBKO – Bowling Green',
    domain: 'wbko.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WBNG – Binghamton',
    domain: 'wbng.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WBNS-TV',
    domain: '10tv.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WBOY – Clarksburg News',
    domain: 'wboy.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WBRC – Birmingham',
    domain: 'wbrc.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WBRE/WYOU Eyewitness News',
    domain: 'pahomepage.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WBTV',
    domain: 'wbtv.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WBTW – Myrtle Beach News',
    domain: 'wbtw.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WCAX3',
    domain: 'wcax.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WCBD – Charleston News',
    domain: 'counton2.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WCIA – Central Illinois News',
    domain: 'wcia.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WCJB – Gainesville',
    domain: 'wcjb.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WCMH – Columbus',
    domain: 'nbc4i.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WCNC – Charlotte News',
    domain: 'wcnc.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WCPO – Cincinnati News',
    domain: 'wcpo.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WCSC – Charleston News',
    domain: 'live5news.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WCTV Eyewitness News',
    domain: 'wctv.tv',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WCVB – Boston News',
    domain: 'wcvb.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WDAF – Kansas City News',
    domain: 'fox4kc.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WDAM – Hattiesburg',
    domain: 'wdam.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WDBD – Jackson News',
    domain: 'fox40jackson.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WDBJ – Roanoke',
    domain: 'wdbj7.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WDCW – DC News Now',
    domain: 'dcnewsnow.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WDHN – Dothan News',
    domain: 'wdhn.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WDIO – Duluth News',
    domain: 'wdio.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WDIV – ClickOnDetroit',
    domain: 'clickondetroit.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WDRB – Louisville News',
    domain: 'wdrb.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WDSU – New Orleans News',
    domain: 'wdsu.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WDTN – Dayton News',
    domain: 'wdtn.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WDTV – Weston News',
    domain: 'wdtv.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WDVM – DCW 50',
    domain: 'localdvm.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'We are the Mighty',
    domain: 'wearethemighty.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WEAU 13 News',
    domain: 'weau.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WECT News 6',
    domain: 'wect.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WEEK – Peoria News',
    domain: '25newsnow.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'We Got This Covered',
    domain: 'wegotthiscovered.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WEHT – Evansville News',
    domain: 'tristatehomepage.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Wellington Advertiser',
    domain: 'wellingtonadvertiser.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Wellington Daily News',
    domain: 'wellingtondailynews.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WENY News',
    domain: 'weny.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Wenxuecity –',
    domain: 'wenxuecity.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WESH – Orlando News',
    domain: 'wesh.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'West Chester Daily Local News',
    domain: 'dailylocal.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Western Mass News',
    domain: 'westernmassnews.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'West Valley View',
    domain: 'westvalleyview.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'West Virginia Public Broadcasting',
    domain: 'wvpublic.org',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WEUX – Eau Claire News',
    domain: 'wiproud.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WEVV – Evansville News',
    domain: 'wevv.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WEWS – News 5 – Cleveland',
    domain: 'news5cleveland.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WFAA – Dallas News',
    domain: 'wfaa.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WFFF – Burlington News',
    domain: 'mychamplainvalley.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WFFT – Fort Wayne News',
    domain: 'wfft.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WFIE – Evansville News',
    domain: '14news.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WFLA – Tampa Bay',
    domain: 'wfla.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WFLD – Fox 32 – Chicago',
    domain: 'fox32chicago.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WFLX – West Palm Beach',
    domain: 'wflx.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WFMZ',
    domain: 'wfmz.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WFRV – Green Bay News',
    domain: 'wearegreenbay.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WFSB – Hartford News',
    domain: 'wfsb.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WFTS – Tampa News',
    domain: 'abcactionnews.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WFTV – Orlando News',
    domain: 'wftv.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WFTX – Fort Myers News',
    domain: 'fox4now.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WFXP – Erie News',
    domain: 'yourerie.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WFXR – Roanoke News',
    domain: 'wfxrtv.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WFXT – Boston News',
    domain: 'boston25news.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WGAL – Lancaster News',
    domain: 'wgal.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WGBA – Green Bay News',
    domain: 'nbc26.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WGCL – Atlanta News',
    domain: 'cbs46.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WGEM – Quincy News',
    domain: 'wgem.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WGHP – Fox8',
    domain: 'myfox8.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WGMB – Baton Rouge News',
    domain: 'brproud.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WGN News',
    domain: 'wgntv.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WGNO – New Orleans News',
    domain: 'wgno.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WGNT – Hampton Roads News',
    domain: 'wtkr.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WGRZ – Buffalo News',
    domain: 'wgrz.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WHAS – Louisville News',
    domain: 'whas11.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WhatCulture',
    domain: 'whatculture.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WHBQ – Memphis News',
    domain: 'fox13memphis.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WHDT – West Palm Beach News',
    domain: 'wptv.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WHEC – Rochester News',
    domain: 'whec.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WHIO – Dayton News',
    domain: 'whio.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Whitefish Pilot',
    domain: 'whitefishpilot.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Whittier Daily News',
    domain: 'whittierdailynews.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WHNS – Greenville News',
    domain: 'foxcarolina.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WHNT News 19',
    domain: 'whnt.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WHO – Des Moines News',
    domain: 'who13.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WHSV-TV',
    domain: 'whsv.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WHTM – Harrisburg News',
    domain: 'abc27.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WIAT – CBS 42',
    domain: 'cbs42.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Wichita Eagle',
    domain: 'kansas.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WICU – Erie News',
    domain: 'erienewsnow.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WICZ – Binghamton News',
    domain: 'wicz.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Wilkes-Barre Citzens’ Voice',
    domain: 'citizensvoice.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WILX 10',
    domain: 'wilx.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WINK – Fort Myers News',
    domain: 'winknews.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Winter Haven News Chief',
    domain: 'newschief.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WIS – Columbia SC News',
    domain: 'wistv.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WISC – Madison News',
    domain: 'channel3000.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WISN – Milwaukee News',
    domain: 'wisn.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WITI – Fox 6 – Milwaukee',
    domain: 'fox6now.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WIVB – Buffalo',
    domain: 'wivb.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WIVT – Binghamton News',
    domain: 'binghamptonhomepage.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WJCL – Savannah News',
    domain: 'wjcl.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WJFB – Lebanon Tennessee News',
    domain: 'wjfb.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WJHG News',
    domain: 'wjhg.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WJHL – Johnson City News',
    domain: 'wjhl.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WJMN – Escanaba News',
    domain: 'upmatters.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WJTV – Jackson News',
    domain: 'wjtv.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WJW – Cleveland News',
    domain: 'fox8.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WJXT – News4Jax',
    domain: 'news4jax.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WKBN – Youngstown News',
    domain: 'wkbn.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WKBT – La Crosse News',
    domain: 'news8000.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WKBW – Buffalo News',
    domain: 'wkbw.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WKMG – ClickOrlando',
    domain: 'clickorlando.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WKOW – Madison News',
    domain: 'wkow.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WKRG News 5',
    domain: 'wkrg.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WKYC – Cleveland News',
    domain: 'wkyc.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WLAS – Lansing News',
    domain: 'wlns.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WLBT – Jackson News',
    domain: 'wlbt.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WLEX – Lexington News',
    domain: 'lex18.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WLFI – Lafayette News',
    domain: 'wlfi.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WLIO – Lima News',
    domain: 'hometownstations.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WLKY – Louisville News',
    domain: 'wlky.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WLOX – Biloxi News',
    domain: 'wlox.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WLTX – Columbia News',
    domain: 'wltx.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WLUC – Upper Peninsula News',
    domain: 'uppermichiganssource.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WLWT – Cincinnati News',
    domain: 'wlwt.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WMAR – Baltimore News',
    domain: 'wmar2news.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WMBB – Panama City News',
    domain: 'mypanhandle.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WMBD – Peoria News',
    domain: 'centralillinoisproud.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WMSN – Madison News',
    domain: 'fox47.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WMTV News',
    domain: 'nbc15.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WMYD –',
    domain: 'tv20detriot.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WNCN – Raleigh',
    domain: 'cbs17.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WNCT – Greenville News',
    domain: 'wnct.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WNDU News Now',
    domain: 'wndu.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WNEM – Bay City News',
    domain: 'wnem.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WNTZ – Alexandria News',
    domain: 'cenlanow.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WNYT – Albany News',
    domain: 'wynt.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WNYW – Fox 5 – New York',
    domain: 'fox5ny.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WOGX – Fox 51 – Gainesville',
    domain: 'wogx.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WOI-DT – Des Moines News',
    domain: 'weareiowa.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WOIO – Cleveland News',
    domain: 'cleveland19.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WOOD – Grand Rapids News',
    domain: 'woodtv.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Worcester News',
    domain: 'worcesternews.co.uk',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Worcester – Spectrum News',
    domain: 'spectrumnews1.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WOWK – Charleston-Huntington News',
    domain: 'wowktv.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WOWT News 6',
    domain: 'wowt.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WPBF – West Palm Beach News',
    domain: 'wpbf.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WPHL 17',
    domain: 'phl17.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WPMT – York News',
    domain: 'fox43.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WPTZ – Plattsburgh News',
    domain: 'mynbc5.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WQAD – Moline News',
    domain: 'wqad.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WQRF – Rockford News',
    domain: 'mystateline.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WREX – Rockford News',
    domain: 'wrex.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WRTV – Indianapolis News',
    domain: 'wrtv.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WSFL – Miami News',
    domain: 'wsfltv.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WSOC – Charlotte News',
    domain: 'wsoctv.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WSYR – Syracuse News',
    domain: 'localsyr.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WTIC – Hartford News',
    domain: 'fox61.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WTMJ – Milwaukee News',
    domain: 'tmj4.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WTRF – Wheeling News',
    domain: 'wtrf.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WTSP – Tampa Bay News',
    domain: 'wtsp.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WTVM – Columbus News',
    domain: 'wtvm.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WTVR – Richmond News',
    domain: 'wtvr.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WTVT – Fox 13 – Tampa Bay',
    domain: 'fox13news.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WTVY Channel 4',
    domain: 'wtvy.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WTWO – Terre Haute News',
    domain: 'mywabashvalley.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WTXL – Tallahassee News',
    domain: 'wtxl.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WikiNews',
    domain: 'en.wikinews.org',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Wikipedia',
    domain: 'wikipedia.org',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Winnipeg Free Press',
    domain: 'winnipegfreepress.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WION (World is One News)',
    domain: 'wionews.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Wisconsin State Journal',
    domain: 'host.madison.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WJKB – Fox 2 – Detroit',
    domain: 'fox2detroit.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WJZY – Charlotte',
    domain: 'fox46.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WKRN – Nashville News',
    domain: 'wkrn.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WKYT',
    domain: 'wkyt.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WLFL CW 22',
    domain: 'raleighcw.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WMAZ – Macon News',
    domain: '13wmaz.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WMC – Memphis News',
    domain: 'actionnews5.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WMTW – Portland News',
    domain: 'wmtw.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WMUR9',
    domain: 'wmur.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WNEP – Scranton News',
    domain: 'wnep.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WOFL',
    domain: 'fox35orlando.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Wolf Street',
    domain: 'wolfstreet.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Woodland Daily Democrat',
    domain: 'dailydemocrat.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Worldometer',
    domain: 'worldometers.info',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'World Politics Review',
    domain: 'worldpoliticsreview.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'World Population Review',
    domain: 'worldpopulationreview.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WPIX 11',
    domain: 'pix11.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WPTA – Fort Wayne',
    domain: 'wpta21.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WPXI',
    domain: 'wpxi.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WQOW – Eau Claire News',
    domain: 'wqow.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WRBL – Columbus News',
    domain: 'wrbl.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WRDW – News 12',
    domain: 'wrdw.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WREG – Memphis',
    domain: 'wreg.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WRIC – Richmond News',
    domain: 'wric.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Wright County Monitor',
    domain: 'clarionnewsonline.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WROC – Rochester First',
    domain: 'rochesterfirst.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WSAV – Savannah News',
    domain: 'wsav.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WSAW-TV',
    domain: 'wsaw.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WSAZ News Channel',
    domain: 'wsaz.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WSB – Atlanta News',
    domain: 'wsbtv.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WSFA – Montgomery',
    domain: 'wsfa.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WSIL – Harrisburg News',
    domain: 'wsiltv.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WSLS – 10 News – Roanoke',
    domain: 'wsls.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WSMV – Nashville',
    domain: 'wsmv.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WSPA – Spartanburg News',
    domain: 'wspa.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WSYM – Lansing News',
    domain: 'fox47news.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WTAE Pittsburgh’s Action News',
    domain: 'wtae.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WTAG – Altoona News',
    domain: 'wearecentralpa.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WTAP – Parkersburg News',
    domain: 'wtap.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WTEN – Albany News',
    domain: 'news10.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WTHI – Terre Haute News',
    domain: 'wthitv.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WTHR – Indianapolis News',
    domain: 'wthr.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WTNH – New Haven News',
    domain: 'wtnh.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WTOK',
    domain: 'wtok.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WTOL – Toledo News',
    domain: 'wtol.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WTTG – Fox 5 – DC',
    domain: 'fox5dc.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WTTV – Indianapolis',
    domain: 'cbs4indy.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WTVA – Tupelo News',
    domain: 'wtva.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WTVF – Newschannel5',
    domain: 'newschannel5.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WTVG 13 Action News',
    domain: '13abc.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WTXF-TV Fox 29',
    domain: 'fox29.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WUTR – Utica News',
    domain: 'cnyhomepage.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WVIR – Charlottesville',
    domain: 'nbc29.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WVNS – Bluefield News',
    domain: 'wvnstv.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WVTM – Birmingham News',
    domain: 'wvtm.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WVUE – New Orleans News',
    domain: 'fox8live.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WVVA – Bluefield News',
    domain: 'wvva.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WWBT – Richmond News',
    domain: 'nbc12.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WWLP – Springfield News',
    domain: 'wwlp.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WWNY – Watertown',
    domain: 'wwnytv.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WWOR – My9 – New Jersey',
    domain: 'my9nj.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WWSB – Sarasota',
    domain: 'mysuncoast.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WWTI – Watertown News',
    domain: 'informnny.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WXII – Winston-Salem News',
    domain: 'wxii12.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WXIN – Fox59 – Indianapolis',
    domain: 'fox59.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WXIX – Cincinnati News',
    domain: 'fox19.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WXMI – Grand Rapids News',
    domain: 'fox17online.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WWL – New Orleans News',
    domain: 'wwltv.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WXOW – La Crosse News',
    domain: 'wxow.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WXYZ – Detroit News',
    domain: 'wxyz.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WYFF – Greenville News',
    domain: 'wyff4.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WYMT – Eastern Kentucky News',
    domain: 'wymt.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WYFX – Youngstown News',
    domain: 'wytv.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WZDX – Huntsville News',
    domain: 'rocketcitynow.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WZMQ – Marquette News',
    domain: 'wzmq19.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WZZM – Grand Rapids News',
    domain: 'wzzm13.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'YLE News',
    domain: 'yle.fi',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'York News-Times',
    domain: 'yorknewstimes.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'ZDNet',
    domain: 'zdnet.com',
    bias_labels: [
      {
        label: 'least biased',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: '7NEWS',
    domain: '7news.com.au',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: '9 News (Australia)',
    domain: '9news.com.au',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: '1945',
    domain: '19fortyfive.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'ABC (Spain)',
    domain: 'abc.es',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Advocates for Self-Government',
    domain: 'theadvocates.org',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Ahram Online',
    domain: 'english.ahram.org.eg',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Airdrie Echo',
    domain: 'airdrieecho.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Al.com (Alabama News)',
    domain: 'al.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Alabama Today',
    domain: 'altoday.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Alabaster Reporter',
    domain: 'shelbycountyreporter.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Albert Lea Tribune',
    domain: 'albertleatribune.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Albuquerque Journal',
    domain: 'abqjournal.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Alexander City Outlook',
    domain: 'alexcityoutlook.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Alexandria Echo Press',
    domain: 'echopress.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'American Action Forum',
    domain: 'americanactionforum.org',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'American Affairs Journal',
    domain: 'americanaffairsjournal.org',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'American Council on Science and Health (ACSH)',
    domain: 'acsh.org',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'American Firearms Institute',
    domain: 'americanfirearms.org',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'American Institute for Economic Research',
    domain: 'aier.org',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'American Military News',
    domain: 'americanmilitarynews.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Americas Quarterly',
    domain: 'americasquarterly.org',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Americus Times-Recorder',
    domain: 'americustimesrecorder.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Anchorage Press',
    domain: 'anchoragepress.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Andalusia Star News',
    domain: 'andalusiastarnews.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Annapolis Valley Register',
    domain: 'saltwire.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Anti-War',
    domain: 'antiwar.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Apple Daily',
    domain: 'hk.appledaily.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'ArcaMax',
    domain: 'arcamax.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Archdale-Trinity News',
    domain: 'hpenews.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Arkansas Democrat-Gazette',
    domain: 'arkansasonline.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Arutz Sheva (Israel National News)',
    domain: 'israelnationalnews.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Asian News International',
    domain: 'aninews.in',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Atlantic Council',
    domain: 'atlanticcouncil.org',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Atmore Advance',
    domain: 'atmoreadvance.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Ayn Rand Institute',
    domain: 'newideal.aynrand.org',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Bainbridge Post-Searchlight',
    domain: 'thepostsearchlight.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Bangkok Post',
    domain: 'bangkokpost.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Baptist Standard',
    domain: 'baptiststandard.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Batesville Daily Guard',
    domain: 'guardonline.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Northern Light',
    domain: 'tj.news',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Beavercreek News-Current',
    domain: 'beavercreeknewscurrent.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Being Libertarian',
    domain: 'beinglibertarian.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Belleville Community Press',
    domain: 'communitypress.ca',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Bellingham Metro News',
    domain: 'bellinghammetronews.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Bemidji Pioneer',
    domain: 'bemidjipioneer.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Berlingske',
    domain: 'berlingske.dk',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Bild',
    domain: 'bild.de',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Billings Gazette',
    domain: 'billingsgazette.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Bill of Rights Institute',
    domain: 'billofrightsinstitute.org',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Bipartisan Policy Center',
    domain: 'bipartisanpolicy.org',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Biznews',
    domain: 'biznews.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'BNR NewsRadio',
    domain: 'bnr.nl',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Bogalusa Daily News',
    domain: 'bogalusadailynews.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'BOOMLIVE',
    domain: 'boomlive.in',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Boston Herald',
    domain: 'bostonherald.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Bowling Green Daily News',
    domain: 'bgdailynews.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Bow Valley Crag & Canyon',
    domain: 'thecragandcanyon.ca',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Brainerd Dispatch',
    domain: 'brainerddispatch.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Breaking Defense',
    domain: 'breakingdefense.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Breakthrough Institute',
    domain: 'thebreakthrough.org',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Brewton Standard',
    domain: 'brewtonstandard.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Bryan Times',
    domain: 'bryantimes.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'B.T. Denmark',
    domain: 'bt.dk',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'BusinessLIVE',
    domain: 'businesslive.co.za',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Business Standard (India)',
    domain: 'business-standard.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Calgary Herald',
    domain: 'calgaryherald.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'California Political Review',
    domain: 'capoliticalreview.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Campaign for Liberty',
    domain: 'campaignforliberty.org',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Canadian Jewish News',
    domain: 'cjnews.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Canadian Taxpayers Federation',
    domain: 'taxpayer.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Capitalism Magazine',
    domain: 'capitalismmagazine.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Cassopolis Vigilant',
    domain: 'leaderpub.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Cato Institute',
    domain: 'cato.org',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Center for European Policy Analysis',
    domain: 'cepa.org',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Center for the National Interest',
    domain: 'cftni.org',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Chatham-Kent This Week',
    domain: 'chathamthisweek.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Check Your Fact',
    domain: 'checkyourfact.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Chicago Tribune',
    domain: 'chicagotribune.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'China Digital Times',
    domain: 'chinadigitaltimes.net',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Christianity Today',
    domain: 'christianitytoday.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Claiborne Progress',
    domain: 'claiborneprogress.net',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Clanton Advertiser',
    domain: 'clantonadvertiser.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Clarin',
    domain: 'clarin.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Cleveland Daily Banner',
    domain: 'clevelandbanner.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Clinton News-Record',
    domain: 'clintonnewsrecord.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Cochrane Times',
    domain: 'cochranetimes.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Cochrane Times-Post',
    domain: 'cochranetimespost.ca',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Cold Lake Sun',
    domain: 'coldlakesun.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Colorado Springs Gazette',
    domain: 'gazette.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Columbia Daily Herald',
    domain: 'columbiadailyherald.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Committee for a Responsible Federal Buddget',
    domain: 'crfb.org',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Connersville News Examiner',
    domain: 'newsexaminer.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Cordele Dispatch',
    domain: 'cordeledispatch.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Counter Extremism Project',
    domain: 'counterextremism.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Critical Threats',
    domain: 'criticalthreats.org',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Dagens Nyheter',
    domain: 'dn.se',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Daily Corinthian',
    domain: 'dailycorinthian.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Daily Herald',
    domain: 'dailyherald.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Daily Mining Gazette',
    domain: 'mininggazette.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Daily Press',
    domain: 'dailypress.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Dallas Morning News',
    domain: 'dallasnews.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Danville Advocate-Messenger',
    domain: 'amnews.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'DC Journal',
    domain: 'dcjournal.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'de Volkskrant',
    domain: 'volkskrant.nl',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Deccan Chronicle',
    domain: 'deccanchronicle.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Delaware Gazette',
    domain: 'delgazette.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Delfi',
    domain: 'delfi.lt',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Demopolis Times',
    domain: 'demopolistimes.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Denver Gazette',
    domain: 'denvergazette.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Deseret News',
    domain: 'deseretnews.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Desert Sun',
    domain: 'desertsun.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Detroit Lakes Tribune',
    domain: 'dl-online.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Detroit News',
    domain: 'detroitnews.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Devon Dispatch',
    domain: 'devondispatch.ca',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Die Presse',
    domain: 'diepresse.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Die Welt',
    domain: 'welt.de',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Douglas County Sentinel',
    domain: 'douglascountysentinel.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Downsizing the Federal Government',
    domain: 'downsizinggovernment.org',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Drayton Valley Western Review',
    domain: 'draytonvalleywesternreview.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Drudge Report',
    domain: 'drudgereport.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'DV Journal',
    domain: 'delawarevalleyjournal.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Eaton Register-Herald',
    domain: 'registerherald.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Eclectic Observer',
    domain: 'thewetumpkaherald.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Ecuavisa',
    domain: 'ecuavisa.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Eddyville Herald Ledger',
    domain: 'heraldledger.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Edmonton Examiner',
    domain: 'edmontonexaminer.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Edmonton Journal',
    domain: 'edmontonjournal.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Edmonton Sun',
    domain: 'edmontonsun.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Education Next',
    domain: 'educationnext.org',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'El Financiero',
    domain: 'elfinanciero.com.mx',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Elizabethtown News-Enterprise',
    domain: 'thenewsenterprise.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'El Mundo',
    domain: 'elmundo.es',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'El Universo',
    domain: 'eluniverso.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'End Time Headlines',
    domain: 'endtimeheadlines.org',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Entrepreneur Magazine',
    domain: 'entrepreneur.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Ethnikos Kyrix',
    domain: 'ekirikas.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Exeter Lakeshore Times-Advance',
    domain: 'lakeshoreadvance.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Expressen',
    domain: 'expressen.se',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Fairborn Daily Herald',
    domain: 'fairborndailyherald.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Fairview Post',
    domain: 'fairviewpost.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Faith Family America',
    domain: 'faithfamilyamerica.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Farmington Daily Times',
    domain: 'daily-times.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'FDD’s Long War Journal',
    domain: 'longwarjournal.org',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Financial Express',
    domain: 'financialexpress.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Financial Post',
    domain: 'financialpost.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'First Post',
    domain: 'firstpost.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Fitch Ratings',
    domain: 'fitchratings.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'FitsNews',
    domain: 'fitsnews.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Forbes',
    domain: 'forbes.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Foreign Policy Research Institute',
    domain: 'fpri.org',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Forest City Daily Courier',
    domain: 'thedigitalcourier.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Fort McMurray Today',
    domain: 'fortmcmurraytoday.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Fort Saskatchewan Record',
    domain: 'fortsaskatchewanrecord.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Fort Worth Star-Telegram',
    domain: 'star-telegram.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Fortnightly Review',
    domain: 'fortnightlyreview.co.uk',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Fortune Magazine',
    domain: 'fortune.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Foundation for Economic Education',
    domain: 'fee.org',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Fox Business',
    domain: 'foxbusiness.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Frankfort State Journal',
    domain: 'state-journal.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Frankfort Times',
    domain: 'ftimes.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Frankfurter Allgemeine Zeitung',
    domain: 'faz.net',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Franklin Daily Journal',
    domain: 'dailyjournal.net',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Franklin News Foundation',
    domain: 'franklinnews.org',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Fraser Institute',
    domain: 'fraserinstitute.org',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Freedom House',
    domain: 'freedomhouse.org',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Fulton County Expositor',
    domain: 'fcnews.org',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Gallipolis Daily Tribune',
    domain: 'mydailytribune.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Galveston County Daily News',
    domain: 'galvnews.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Gananoque Reporter',
    domain: 'gananoquereporter.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'GEO TV (Pakistan)',
    domain: 'geo.tv',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Goderich Signal-Star',
    domain: 'goderichsignalstar.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'GodUpdates',
    domain: 'godupdates.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Goldsboro News Argus',
    domain: 'newsargus.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Göteborgs-Posten',
    domain: 'gp.se',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Grand Forks Herald',
    domain: 'grandforksherald.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Grand Haven Tribune',
    domain: 'grandhaventribune.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Grayson County News Gazette',
    domain: 'messenger-inquirer.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Greenfield Daily Reporter',
    domain: 'greenfieldreporter.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Greenville Advocate',
    domain: 'greenvilleadvocate.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Greenville Daily Advocate',
    domain: 'dailyadvocate.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Grey Bruce This Week',
    domain: 'greybrucethisweek.ca',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Griffin Daily News',
    domain: 'griffindailynews.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Guns.com',
    domain: 'guns.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Hammond Daily Star',
    domain: 'hammondstar.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Hanna Herald',
    domain: 'hannaherald.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Haralson County Gateway-Beacon',
    domain: 'times-georgian.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Harlan Enterprise',
    domain: 'harlanenterprise.net',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Heber Springs Sun-Times',
    domain: 'thesuntimes.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Herald/Review Media',
    domain: 'myheraldreview.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Herald Sun (AUS)',
    domain: 'heraldsun.com.au',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Het Laatste Nieuws (HLN)',
    domain: 'hln.be',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Hi-Desert Star',
    domain: 'hidesertstar.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'High River Times',
    domain: 'highrivertimes.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Hillsboro Times-Gazette',
    domain: 'timesgazette.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Hindu Business Line',
    domain: 'thehindubusinessline.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Honest Reporting',
    domain: 'honestreporting.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Hoover Institution',
    domain: 'hoover.org',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Human Progress',
    domain: 'humanprogress.org',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Huntington Herald-Press',
    domain: 'h-ponline.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Icitizen',
    domain: 'icitizen.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Idaho State Journal',
    domain: 'idahostatejournal.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Il Giornale',
    domain: 'ilgiornale.it',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'In Homeland Security',
    domain: 'inhomelandsecurity.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'India Times',
    domain: 'indiatimes.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'India Today',
    domain: 'indiatoday.in',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'India TV',
    domain: 'indiatvnews.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'InsideSources',
    domain: 'insidesources.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Institute for Humane Studies',
    domain: 'theihs.org',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Interfax – Russia',
    domain: 'interfax.ru',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Institute for the Study of War',
    domain: 'undertandingwar.org',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Investor Times',
    domain: 'investortimes.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Irish Independent',
    domain: 'independent.ie',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'ITV News',
    domain: 'itv.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Jamestown Sun',
    domain: 'jamestownsun.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Jerusalem Post',
    domain: 'jpost.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Jessamine Journal',
    domain: 'jessaminejournal.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Jewish Breaking News',
    domain: 'jewishbreakingnews.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Jewish Journal',
    domain: 'jewishjournal.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Jewish News Syndicate',
    domain: 'jns.org',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Jewish Unpacked',
    domain: 'jewishunpacked.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Jonesboro Sun',
    domain: 'jonesborosun.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Just Facts',
    domain: 'justfacts.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Just Facts Daily',
    domain: 'justfactsdaily.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KAAS – Wichita News',
    domain: 'foxkansas.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KABB – Fox 29',
    domain: 'foxsanantonio.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Kalamazoo News – WWMT',
    domain: 'wwmt.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Khaleej Times',
    domain: 'khaleejtimes.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KATU2',
    domain: 'katu.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KATV – Little Rock News',
    domain: 'katv.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KBAK – Bakersfield Now',
    domain: 'bakersfieldnow.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KBSI – Cape Girardeau News',
    domain: 'kbsi23.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KBTV – Beaumont News',
    domain: 'fox4beaumont.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KBVK – Sioux City News',
    domain: 'siouxlandnews.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KCBY – North Bend News',
    domain: 'kcby.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KDNL – St. Louis News',
    domain: 'abcstlouis.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KDSM – Des Moines News',
    domain: 'kdsm17.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KECI – Missoula News',
    domain: 'nbcmontana.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Kentucky New Era',
    domain: 'kentuckynewera.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KEPR – Pasco News',
    domain: 'keprtv.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KFDM – Beaumont News',
    domain: 'kfdm.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KFOX – El Paso News',
    domain: 'kfoxtv.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KFXA – Waterloo News',
    domain: 'cbs2iowa.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KFXL – Lincoln News',
    domain: 'foxnebraska.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KHQA – Quincy News',
    domain: 'khqa.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KIMA – Yakima News',
    domain: 'kimatv.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Kingston This Week',
    domain: 'kingstonthisweek.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KLEW TV – Lewiston News',
    domain: 'klewtv.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KMPH – Fox 26',
    domain: 'kmph.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KMTR – NBC16 – Springfield',
    domain: 'nbc16.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Knewz',
    domain: 'knewz.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KOKH – Fox 25',
    domain: 'okcfox.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KOMO 4 News',
    domain: 'komonews.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Korean Herald',
    domain: 'koreaherald.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KRCG – Jefferson City',
    domain: 'krcgtv.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KRNV – Reno News',
    domain: 'mynews4.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KRXI – Fox 11',
    domain: 'foxreno.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KSCC – Corpus Christi News',
    domain: 'fox38corpuschristi.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KSNV – Las Vegas',
    domain: 'news3lv.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KTUL – Tulsa News',
    domain: 'ktul.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KTVL – Medford News',
    domain: 'ktvl.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KUTV Salt Lake City',
    domain: 'kutv.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KVIH – Clovis News',
    domain: 'abc7amarillo.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KWNB – NTV ABC',
    domain: 'nebraska.tv',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'LaGrange Daily News',
    domain: 'lagrangenews.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Lake Charles American Press',
    domain: 'americanpress.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'La Nacion',
    domain: 'nacion.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'La Nacion (Argentina)',
    domain: 'lanacion.com.ar',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Lanett Valley Times-News',
    domain: 'valleytimes-news.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'L’Observateur',
    domain: 'lobservateur.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'La Porte County Herald-Dispatch',
    domain: 'lpheralddispatch.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Las Vegas Review Journal',
    domain: 'reviewjournal.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Learn Liberty',
    domain: 'learnliberty.org',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Lebanon Democrat',
    domain: 'lebanondemocrat.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Leduc Representative',
    domain: 'leducrep.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Le Figaro',
    domain: 'lefigaro.fr',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Leicester Mercury',
    domain: 'leicestermercury.co.uk',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Lenoir News-Topic',
    domain: 'newstopicnews.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Le Parisien',
    domain: 'leparisien.fr',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Lexington Institute',
    domain: 'lexingtoninstitute.org',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Libertarianism.org',
    domain: 'libertarianism.org',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Liberty Courier-Tribune',
    domain: 'mycouriertribune.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'ListVerse',
    domain: 'listverse.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Log Cabin Democrat',
    domain: 'thecabin.net',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'London Broadcasting Company (LBC)',
    domain: 'lbc.co.uk',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'London Evening Standard',
    domain: 'standard.co.uk',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'London Free Press',
    domain: 'lfpress.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Los Angeles Daily News',
    domain: 'dailynews.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Lowndes Signal',
    domain: 'lowndessignal.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Luverne Journal',
    domain: 'luvernejournal.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Mackinac Center for Public Policy',
    domain: 'mackinac.org',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Madisonville Messenger',
    domain: 'the-messenger.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Malay Mail',
    domain: 'malaymail.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Manchester Union leader',
    domain: 'unionleader.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Manila Times',
    domain: 'manilatimes.net',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Marginal Revolution',
    domain: 'marginalrevolution.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Marion Chronicle-Tribune',
    domain: 'chronicle-tribune.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'MarketWatch',
    domain: 'marketwatch.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Marshall County Tribune-Courier',
    domain: 'tribunecourier.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Mat-Su Valley Frontiersman',
    domain: 'frontiersman.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Mayerthorpe Freelancer',
    domain: 'mayerthorpefreelancer.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Mayfield Messenger',
    domain: 'mayfield-messenger.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Mercatus',
    domain: 'mercatus.org',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Metabunk',
    domain: 'metabunk.org',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Metropolis Planet',
    domain: 'metropolisplanet.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Middlesboro Daily News',
    domain: 'middlesboronews.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Mitchell Daily Republic',
    domain: 'mitchellrepublic.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Monroe Enquirer Journal',
    domain: 'enquirerjournal.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Montreal Gazette',
    domain: 'montrealgazette.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Morocco World News',
    domain: 'moroccoworldnews.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Moscow 24',
    domain: 'm24.ru',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Mountain Democrat',
    domain: 'mtdemocrat.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Mount Carmel Register',
    domain: 'hometownregister.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'MyNorthwest',
    domain: 'mynorthwest.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Nanton News',
    domain: 'nantonnews.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'National Affairs',
    domain: 'nationalaffairs.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'National Interest',
    domain: 'nationalinterest.org',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'National Post',
    domain: 'nationalpost.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Netherlands Radio and Television Association',
    domain: 'nos.nl',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'New Bern Sun Journal',
    domain: 'newbernsj.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'New Castle Courier-Times',
    domain: 'thecouriertimes.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'New York Observer',
    domain: 'observer.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'New York Post',
    domain: 'nypost.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'News.com.au',
    domain: '.news.com.au',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'News-Gazette',
    domain: 'news-gazette.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Newsroom New Zealand',
    domain: 'newsroom.co.nz',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Newstalk ZB',
    domain: 'newstalkzb.co.nz',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Newsweek',
    domain: 'newsweek.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'NH Journal',
    domain: 'nhjournal.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Northwest Arkansas Democrat-Gazette',
    domain: 'nwaonline.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Northwest Signal',
    domain: 'northwestsignal.net',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Noticias R7',
    domain: 'noticias.r7.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Now Entertainment',
    domain: 'nowentertainment.net',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Ny Teknik',
    domain: 'nyteknik.se',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Oil Price',
    domain: 'oilprice.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Open Doors',
    domain: 'opendoorsusa.org',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Opposing Views',
    domain: 'opposingviews.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Orange County Register',
    domain: 'ocregister.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Ottawa Citizen',
    domain: 'ottawacitizen.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Ottawa Sun',
    domain: 'ottawasun.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Pacific Research Institute',
    domain: 'pacificresearch.org',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Paducah Sun',
    domain: 'paducahsun.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Paragould Daily Press',
    domain: 'paragoulddailypress.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Parkersburg News and Sentinel',
    domain: 'newsandsentinel.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Peace Country Sun',
    domain: 'peacecountrysun.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Peace River Record-Gazette',
    domain: 'prrecordgazette.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Peninsula Daily News',
    domain: 'peninsuladailynews.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Peru Tribune',
    domain: 'perutribune.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Pincher Creek Echo',
    domain: 'pinchercreekecho.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Pittsburgh Post-Gazette',
    domain: 'post-gazette.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Pittsburgh Tribune Review',
    domain: 'triblive.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Point Pleasant Register',
    domain: 'mydailyregister.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'PolicyEd.org',
    domain: 'policyed.org',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Pomeroy Daily Sentinel',
    domain: 'mydailysentinel.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Portsmouth Daily Times',
    domain: 'portsmouth-dailytimes.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Prime 9ja Online',
    domain: 'prime9ja.com.ng',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Prince George Post',
    domain: 'princegeorgepost.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Princeton Daily Clarion',
    domain: 'pdclarion.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Punjabi Tribune',
    domain: 'punjabitribuneonline.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'R Street Institute',
    domain: 'rstreet.org',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Rasmussen Reports',
    domain: 'rasmussenreports.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Real Clear Defense',
    domain: 'realcleardefense.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Real Clear Investigations',
    domain: 'realclearinvestigations.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Real Clear Markets',
    domain: 'realclearmarkets.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Real Clear Policy',
    domain: 'realclearpolicy.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Real Clear Politics',
    domain: 'realclearpolitics.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'RealClearReligion',
    domain: 'realclearreligion.org',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Reason',
    domain: 'reason.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Red River Valley News',
    domain: 'valleynewslive.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Reforma',
    domain: 'reforma.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Regina Leader-Post',
    domain: 'leaderpost.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Remington Research Group',
    domain: 'remingtonresearchgroup.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Republic World',
    domain: 'republicworld.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Roanoke Rapids Daily Herald',
    domain: 'rrdailyherald.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Rochester Sentinel',
    domain: 'rochsent.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'RTL Nieuws',
    domain: 'rtlnieuws.nl',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Russellville Courier',
    domain: 'couriernews.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Russellville News-Democrat & Leader',
    domain: 'franklinfavorite.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Salem Radio Network News',
    domain: 'srnnews.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'San Bernadino Sun',
    domain: 'sbsun.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Sanford Herald',
    domain: 'sanfordherald.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Saskatoon StarPhoenix',
    domain: 'thestarphoenix.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Savannah Morning News',
    domain: 'savannahnow.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Scope Ratings',
    domain: 'scoperatings.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Searcy Daily Citizen',
    domain: 'thedailycitizen.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Seeking Alpha',
    domain: 'seekingalpha.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Selma Times-Journal',
    domain: 'selmatimesjournal.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Sevierville Mountain Press',
    domain: 'themountainpress.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Shelbyville News',
    domain: 'shelbynews.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Sherwood Park News',
    domain: 'sherwoodparknews.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'SOFREP',
    domain: 'sofrep.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'SOL Newspaper',
    domain: 'sol.sapo.pt',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'South Haven Tribune',
    domain: 'heraldpalladium.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Southwest Daily News',
    domain: 'southwestdailynews.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Spruce Grove Examiner',
    domain: 'sprucegroveexaminer.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'St. Paul Pioneer Press',
    domain: 'twincities.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Stanford Interior Journal',
    domain: 'theinteriorjournal.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Stony Plain Reporter',
    domain: 'stonyplainreporter.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Tablet Magazine',
    domain: 'tabletmag.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Tallassee Tribune',
    domain: 'tallasseetribune.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Tax Foundation',
    domain: 'taxfoundation.org',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Tharawat Magazine',
    domain: 'tharawat-magazine.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Algemeiner Journal',
    domain: 'algemeiner.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The American Conservative',
    domain: 'theamericanconservative.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Australian',
    domain: 'theaustralian.com.au',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Chattanoogan',
    domain: 'chattanoogan.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Chosun Ilbo',
    domain: 'english.chosun.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Chronicle Herald',
    domain: 'thechronicleherald.ca',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Courier Mail',
    domain: 'couriermail.com.au',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Dickinson Press',
    domain: 'thedickinsonpress.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Dispatch',
    domain: 'thedispatch.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Durango Herald',
    domain: 'durangoherald.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Fiscal Times',
    domain: 'thefiscaltimes.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Gazette (Cedar Rapids)',
    domain: 'thegazette.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Globe and Mail (Toronto)',
    domain: 'theglobeandmail.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Graphic Leader',
    domain: 'thegraphicleader.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Independent Institute',
    domain: 'independent.org',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Japan News',
    domain: 'the-japan-news.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Jewish Press',
    domain: 'jewishpress.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Journal (West Virginia)',
    domain: 'journal-news.net',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Libertarian Republic',
    domain: 'thelibertarianrepublic.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Messenger',
    domain: 'themessenger.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Nation Pakistan',
    domain: 'nation.com.pk',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The New Atlantis',
    domain: 'thenewatlantis.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The News International',
    domain: 'thenews.com.pk',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Objective Standard',
    domain: 'theobjectivestandard.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Oklahoman',
    domain: 'oklahoman.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Pantagraph',
    domain: 'pantagraph.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Post-Journal (Jamestown, New York)',
    domain: 'post-journal.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Press-Enterprise',
    domain: 'pe.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Seymour Tribune',
    domain: 'tribtown.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Spectator (uk)',
    domain: 'spectator.co.uk',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Spectator (USA)',
    domain: 'spectator.us',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Spectator World',
    domain: 'spectatorworld.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Standard (Kenya)',
    domain: 'standardmedia.co.ke',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Straits Times',
    domain: 'straitstimes.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'TheStreet',
    domain: 'thestreet.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Sumter Item',
    domain: 'theitem.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Times Herald (Port Huron)',
    domain: 'thetimesherald.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Times of India',
    domain: 'timesofindia.indiatimes.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Times UK and Sunday Times',
    domain: 'thetimes.co.uk',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Tribune (India)',
    domain: 'tribuneindia.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Washington Institute for Near East Policy',
    domain: 'washingtoninstitute.org',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The West Australian',
    domain: 'thewest.com.au',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Yomiuri Shimbun',
    domain: 'yomiuri.co.jp',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Times News (Pennsylvania)',
    domain: 'tnonline.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Times of South Africa',
    domain: 'timeslive.co.za',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'TND – The National Desk',
    domain: 'thenationaldesk.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Toledo Blade',
    domain: 'toledoblade.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'To Vima',
    domain: 'tovima.gr',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Transparent California',
    domain: 'transparentcalifornia.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Troy Messenger',
    domain: 'troymessenger.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Tyler Morning Telegraph',
    domain: 'tylerpaper.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Unherd',
    domain: 'unherd.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'ValueWalk',
    domain: 'valuewalk.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Vancouver Province',
    domain: 'theprovince.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Vancouver Sun',
    domain: 'vancouversun.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Vatican Radio',
    domain: 'vaticannews.va',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Vermilion Standard',
    domain: 'vermilionstandard.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Vincennes Sun-Commercial',
    domain: 'suncommercial.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Vulcan Advocate',
    domain: 'vulcanadvocate.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Wabash Plain Dealer',
    domain: 'wabashplaindealer.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WACH – Columbia News',
    domain: 'wach.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Wall Street Journal',
    domain: 'wsj.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Warrick County Standard',
    domain: 'warricknews.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Washington C H Record Herald',
    domain: 'recordherald.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Waterbury Republican-American',
    domain: 'rep-am.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WBFF – Baltimore News',
    domain: 'foxbaltimore.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WBMA – Birmingham News',
    domain: 'abc3340.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WCHS – Charleston News',
    domain: 'wchstv.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WCIV – Charleston News',
    domain: 'abcnews4.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WCTI – New Bern News',
    domain: 'wcti12.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WCYB – Bristol News',
    domain: 'wcyb.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WDKY – Lexington News',
    domain: 'foxlexington.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WEAR TV – Pensacola News',
    domain: 'weartv.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'West Central Tribune',
    domain: 'wctrib.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Wetaskiwin Times',
    domain: 'wetaskiwintimes.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WEYI – Saginaw News',
    domain: 'nbc25news.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WFXL – Albany GA',
    domain: 'wfxl.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WGME – CBS 13',
    domain: 'wgme.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WGTQ – Sault Ste Marie',
    domain: 'upnorthlive.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WGXA News',
    domain: 'wgxa.tv',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WHAM – Rochester News',
    domain: '13wham.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Whitecourt Star',
    domain: 'whitecourtstar.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WHP – Harrisburg News',
    domain: 'local21news.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WICS – Springfield News',
    domain: 'newschannel20.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Wilkes Journal-Patriot',
    domain: 'journalpatriot.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Williamsport Sun-Gazette',
    domain: 'sungazette.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Willoughby News-Herald',
    domain: 'news-herald.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Wilmington News Journal',
    domain: 'wnewsj.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Winchester Sun',
    domain: 'winchestersun.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Windsor Star',
    domain: 'windsorstar.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Winnipeg Sun',
    domain: 'winnipegsun.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WJAC – NBC 6',
    domain: 'wjactv.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WJAR – Providence News',
    domain: 'turnto10.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WJBC – 1230AM – Bloomington',
    domain: 'wjbc.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WJLA – ABC 7',
    domain: 'wjla.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WJR – 760AM – Detroit',
    domain: 'wjr.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WKEF – Dayton News',
    domain: 'dayton247now.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WKRC – Cincinnati',
    domain: 'local12.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WLOS (ABC13News)',
    domain: 'wlos.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WLUK – Fox 11',
    domain: 'fox11online.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WNBW – Gainesville News',
    domain: 'mycbs4.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WNWO 24 News',
    domain: 'nbc24.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WOAI – San Antonio News',
    domain: 'news4sanantonio.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WOLF – Fox56',
    domain: 'fox56.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Worthington Globe',
    domain: 'dglobe.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WPDE – Florence News',
    domain: 'wpde.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WPEC – CBS12.com',
    domain: 'cbs12.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WPFO – Portland News',
    domain: 'fox23maine.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WPGH – Pittsburgh News',
    domain: 'wpgh53.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WPMI – Mobile News',
    domain: 'mynbc15.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WRGB – Albany',
    domain: 'cbs6albany.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WRLH – Richmond News',
    domain: 'foxrichmond.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WSBT 22 News',
    domain: 'wsbt.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WSET – Lynchburg News',
    domain: 'wset.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WSTM – CNYCentral',
    domain: 'cnycentral.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WSYX',
    domain: 'abc6onyourside.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WTGS – Savannah',
    domain: 'fox28media.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WTOV Steubenville-Wheeling',
    domain: 'wtov9.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WTTE – Columbus News',
    domain: 'myfox28columbus.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WTVC – ABC Chattanooga',
    domain: 'newschannel9.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WTVC – Chattanooga',
    domain: 'foxchattanooga.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WTWC – Tallahassee News',
    domain: 'wtwc40.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WUHF – Rochester',
    domain: 'foxrochester.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WUTV – Buffalo News',
    domain: 'wutv29.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WVAH – Charleston News',
    domain: 'wvah.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WXLV – Winston-Salem',
    domain: 'abc45.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WZTV – Nashville',
    domain: 'fox17.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Xenia Gazette',
    domain: 'xeniagazette.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Yonhap News Agency',
    domain: 'en.yna.co.kr',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Zebra Fact Check',
    domain: 'zebrafactcheck.com',
    bias_labels: [
      {
        label: 'center-right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Accuracy in Academia (AIA)',
    domain: 'academia.org',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Accuracy in Media',
    domain: 'aim.org',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Acton Institute',
    domain: 'acton.org',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Alberta Press Leader',
    domain: 'albertapressleader.ca',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'AltNewsMedia.net',
    domain: 'altnewsmedia.net',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'AMAC (Association of Mature American Citizens)',
    domain: 'amac.us',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'America Insider',
    domain: 'americainsider.org',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'America Rising PAC',
    domain: 'americarisingpac.org',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'American Center for Law & Justice (ACLJ)',
    domain: 'aclj.org',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'American Consequences',
    domain: 'americanconsequences.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'American Conservative Union (ACU)',
    domain: 'conservative.org',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'American Enterprise Institute',
    domain: 'aei.org',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'American for Prosperity',
    domain: 'americansforprosperity.org',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Americans for Tax Reform (ATR)',
    domain: 'atr.org',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'American Foreign Policy council',
    domain: 'afpc.org',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'American Greatness',
    domain: 'amgreatness.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'American Journal Daily',
    domain: 'americanjournaldaily.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'American Legislative Exchange Council (ALEC)',
    domain: 'alec.org',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'American Spectator',
    domain: 'spectator.org',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'American Wire News',
    domain: 'americanwirenews.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Ami Magazine',
    domain: 'amimagazine.org',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Ammoland',
    domain: 'ammoland.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Anadolu Agency',
    domain: 'aa.com.tr',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Ann Arbor’s Talk 1290 WLBY',
    domain: '1290wlby.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Arizona Daily Independent',
    domain: 'arizonadailyindependent.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Armstrong Economics',
    domain: 'armstrongeconomics.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Asian Dawn',
    domain: 'asian-dawn.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Assyrian International News Agency',
    domain: 'aina.org',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Bearing Arms',
    domain: 'bearingarms.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Beliefnet',
    domain: 'beliefnet.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Birmingham’s Real Talk',
    domain: 'talk995.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'BizPac Review',
    domain: 'bizpacreview.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Blabber Buzz',
    domain: 'blabber.buzz',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Black Community News',
    domain: 'blackcommunitynews.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Blue Lives Matter',
    domain: 'bluelivesmatter.blue',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Bounding Into Comics',
    domain: 'boundingintocomics.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Brownstone Institute',
    domain: 'brownstone.org',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'C2C Journal',
    domain: 'c2cjournal.ca',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Calgary Sun',
    domain: 'calgarysun.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'CAMERA',
    domain: 'camera.org',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Campaign Life Coalition',
    domain: 'campaignlifecoalition.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Campus Reform',
    domain: 'campusreform.org',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Capital Research Center',
    domain: 'capitalresearch.org',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Catholic World Report',
    domain: 'catholicworldreport.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Center of the American Experiment',
    domain: 'americanexperiment.org',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Chicks on the Right',
    domain: 'chicksontheright.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Christian Headlines',
    domain: 'christianheadlines.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Christian News Alert',
    domain: 'christiannewsalerts.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Christian Post',
    domain: 'christianpost.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Christian Today',
    domain: 'christiantoday.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Chronicles Magazine',
    domain: 'chroniclesmagazine.org',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Citizen Free Press',
    domain: 'citizenfreepress.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Citizens Against Government Waste',
    domain: 'cagw.org',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Citizens United',
    domain: 'citizensunited.org',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'City Journal',
    domain: 'city-journal.org',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Civitas Institute',
    domain: 'nccivitas.org',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Claremont Institute',
    domain: 'claremont.org',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Cold Dead Hands',
    domain: 'colddeadhands.us',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Commentary Magazine',
    domain: 'commentarymagazine.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Concealed Nation',
    domain: 'concealednation.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Conservative Brief',
    domain: 'conservativebrief.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Conservative Fighters',
    domain: 'conservativefighters.co',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Conservative Home',
    domain: 'conservativehome.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Conservative HQ',
    domain: 'conservativehq.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Conservative Institute',
    domain: 'conservativeinstitute.org',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Conservative Opinion',
    domain: 'conservativeopinion.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Conservative Parternship Institute – CPI',
    domain: 'cpi.org',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Conservative Review',
    domain: 'conservativereview.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Conservative Today',
    domain: 'conservativetoday.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Crime Prevention Research Center',
    domain: 'crimeresearch.org',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Crisis Magazine',
    domain: 'crisismagazine.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Cumulus Media',
    domain: 'cumulusmedia.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Daily Caller',
    domain: 'dailycaller.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Daily Express',
    domain: 'express.co.uk',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Daily Liberator',
    domain: 'thedailyliberator.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Daily Reckoning',
    domain: 'dailyreckoning.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Daily Signal',
    domain: 'dailysignal.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Daily Telegraph (UK)',
    domain: 'telegraph.co.uk',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Dallas Express',
    domain: 'dallasexpress.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'DC Enquirer',
    domain: 'dcenquirer.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'DC Statesman',
    domain: 'dcstatesman.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Daily Torch',
    domain: 'dailytorch.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'De Telegraaf',
    domain: 'telegraaf.nl',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Disrn',
    domain: 'disrn.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'DML News',
    domain: 'teamdml.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Dollar Collapse',
    domain: 'dollarcollapse.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Dorchester Review',
    domain: 'dorchesterreview.ca',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'EconomicPolicyJournal.com',
    domain: 'economicpolicyjournal.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Egypt Today',
    domain: 'egypttoday.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Energy Citizens',
    domain: 'energycitizens.org',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Ethics and Public Policy Center (EPPC)',
    domain: 'eppc.org',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Ethics & Religious Liberty Commission',
    domain: 'erlc.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Explain America',
    domain: 'explainamerica.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Facts and Logic about the Middle East',
    domain: 'factsandlogic.org',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'FaithWire',
    domain: 'faithwire.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Fake Hate Crimes',
    domain: 'fakehatecrimes.org',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Federalist Society',
    domain: 'fedsoc.org',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Fight the New Drug',
    domain: 'fightthenewdrug.org',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'First Things Magazine',
    domain: 'firstthings.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Florida Daily',
    domain: 'floridadaily.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Foundation for Defense of Democracies',
    domain: 'defenddemocracy.org',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Free Republic',
    domain: 'freerepublic.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'FreedomWorks',
    domain: 'freedomworks.org',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Frontiers of Freedom',
    domain: 'ff.org',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Future of Freedom Foundation',
    domain: 'fff.org',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Get Religion',
    domain: 'getreligion.org',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Government Accountablity Institute',
    domain: 'g-a-i.org',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Grabien News',
    domain: 'news.grabien.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Guido Fawkes',
    domain: 'order-order.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Heritage Foundation',
    domain: 'heritage.org',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Hot Air',
    domain: 'hotair.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Hudson Institute',
    domain: 'hudson.org',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Human Events',
    domain: 'humanevents.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Hurriyet',
    domain: 'hurriyet.com.tr',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Hurriyet Daily News',
    domain: 'hurriyetdailynews.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'I Bleed Red White and Blue',
    domain: 'ibleedredwhiteblue.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Illinois Policy Institute',
    domain: 'illinoispolicy.org',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Imprimis',
    domain: 'imprimis.hillsdale.edu',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Independent Journal Review',
    domain: 'ijr.org',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Independent Women’s Forum',
    domain: 'iwf.org',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Influence Watch',
    domain: 'influencewatch.org',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Institute for Family Studies',
    domain: 'ifstudies.org',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Intellectual Takeout',
    domain: 'intellectualtakeout.org',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Investors Business Daily',
    domain: 'investors.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Israel Hayom',
    domain: 'israelhayom.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Issues & Insights',
    domain: 'issuesinsights.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Jewish Policy Center',
    domain: 'jewishpolicycenter.org',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Jewish World Review',
    domain: 'jewishworldreview.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Judicial Crisis Network',
    domain: 'judicialnetwork.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Kansas Policy Institute',
    domain: 'kansaspolicy.org',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KBOI – 93.1fm – Boise',
    domain: 'kboi.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KKOB – 96.3 – Albuquerque',
    domain: 'newsradiokkob.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KLIF – 570AM – Dallas',
    domain: 'klif.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Kronen Zeitung',
    domain: 'krone.at',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KUGN – 590 AM – Eugene',
    domain: 'kugn.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KVOR – 740AM – Colorado Springs',
    domain: 'kvor.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Latestly',
    domain: 'latestly.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Law & Liberty',
    domain: 'lawliberty.org',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Law Enforcement Today',
    domain: 'lawenforcementtoday.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Legal Insurrection',
    domain: 'legalinsurrection.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Le Journal de Montreal',
    domain: 'journaldemontreal.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Liberty Headlines',
    domain: 'libertyheadlines.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Liberty Nation',
    domain: 'libertynation.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Lone Conservative',
    domain: 'loneconservative.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Lozier Institute',
    domain: 'lozierinstitute.org',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Manhattan Institute for Policy Research',
    domain: 'manhattan-institute.org',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Media Research Center (MRC',
    domain: 'mrc.org',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Media Right News',
    domain: 'mediarightnews.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Mercatornet',
    domain: 'mercatornet.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Milliyet',
    domain: 'milliyet.com.tr',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Mises Institute',
    domain: 'mises.org',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'MxM News',
    domain: 'mxmnews.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'National Catholic Register',
    domain: 'ncregister.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'National Center for Public Policy Research',
    domain: 'nationalcenter.org',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'National Federation of Republican Women',
    domain: 'nfrw.org',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'National Review',
    domain: 'nationalreview.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'New Boston Post',
    domain: 'newbostonpost.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Newsbusters',
    domain: 'newsbusters.org',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'New York Sun',
    domain: 'nysun.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'NGO Monitor',
    domain: 'ngo-monitor.org',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Not the Bee',
    domain: 'notthebee.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Nova24TV',
    domain: 'nova24tv.si',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'NRA – Institute for Legislative Action',
    domain: 'nraila.org',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'NTK Network',
    domain: 'ntknetwork.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Numbers USA',
    domain: 'numbersusa.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Offgrid Survival',
    domain: 'offgridsurvival.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'One Angry Gamer',
    domain: 'oneangrygamer.net',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Ontario Proud',
    domain: 'ontarioproud.ca',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'OpenVAERS',
    domain: 'openvaers.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'OpIndia',
    domain: 'opindia.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'OpsLens',
    domain: 'opslens.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'OutKick',
    domain: 'outkick.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'PanAm Post',
    domain: 'panampost.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Pants of Fire News',
    domain: 'pantsonfirenews.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Parents Defending Education',
    domain: 'defendinged.org',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Patriot News Alerts',
    domain: 'patriotnewsalerts.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Patriot News Daily',
    domain: 'patriotnewsdaily.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Pluralist',
    domain: 'pluralist.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Politicalite',
    domain: 'politicalite.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Politichicks',
    domain: 'politichicks.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Powerline',
    domain: 'powerlineblog.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Proud Conservative',
    domain: 'conservativesus.party',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Public Interest Legal Foundation',
    domain: 'publicinterestlegal.org',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Quadrant Magazine',
    domain: 'quadrant.org.au',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Reader’s Digest',
    domain: 'rd.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Real America’s Voice',
    domain: 'americasvoice.news',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Reclaim the Net',
    domain: 'reclaimthenet.org',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Richochet',
    domain: 'ricochet.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Right & Free',
    domain: 'rightandfree.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Ron Paul Liberty Report',
    domain: 'ronpaullibertyreport.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Rare News',
    domain: 'rare.us',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Sabah',
    domain: 'sabah.com.tr',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Save Jersey',
    domain: 'savejersey.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Sentinel KSMO',
    domain: 'sentinelksmo.org',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Shore News Network',
    domain: 'shorenewsnetwork.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Sinclair Broadcast Group',
    domain: 'sbgi.net',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Sky News Australia',
    domain: 'skynews.com.au',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Sonoran News',
    domain: 'sonorannews.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Sons of 1776',
    domain: 'sonsof1776.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Spiked Magazine',
    domain: 'spiked-online.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Tampa Free Press',
    domain: 'tampafp.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Tatum Report',
    domain: 'tatumreport.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Tenth Amendment Center',
    domain: 'tenthamendmentcenter.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Advertiser',
    domain: 'adelaidenow.com.au',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The America First Policy Institute (AFPI)',
    domain: 'americafirstpolicy.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The American Cause',
    domain: 'theamericancause.org',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The American Mind',
    domain: 'americanmind.org',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The College Fix',
    domain: 'thecollegefix.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Conservative Woman',
    domain: 'conservativewoman.co.uk',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Daily Telegraph (AUS)',
    domain: 'dailytelegraph.com.au',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Daily Wire',
    domain: 'dailywire.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The First TV',
    domain: 'thefirsttv.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Honest Patriot',
    domain: 'thehonestpatriot.net',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Library of Economics and Liberty',
    domain: 'econlib.org',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The National Herald',
    domain: 'thenationalherald.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The New American',
    domain: 'thenewamerican.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The New Revere',
    domain: 'thenewrevere.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Patriot Post',
    domain: 'patriotpost.us',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Post Millennial',
    domain: 'thepostmillennial.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Punching Bag Post',
    domain: 'punchingbagpost.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Star (Malaysia)',
    domain: 'thestar.com.my',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Sun',
    domain: 'thesun.co.uk',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Texan',
    domain: 'thetexan.news',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Truth About Guns',
    domain: 'thetruthaboutguns.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The US Sun',
    domain: 'the-sun.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'TimCast',
    domain: 'timcast.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'TIPP Insights',
    domain: 'tippinsights.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Toronto Sun',
    domain: 'torontosun.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Trending Views',
    domain: 'trendingviews.co',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'True North Centre for Public Policy',
    domain: 'tnc.news',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'TRT World',
    domain: 'trtworld.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'TVP Info',
    domain: 'tvp.info',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Twitchy',
    domain: 'twitchy.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'UN Watch',
    domain: 'unwatch.org',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Valiant News',
    domain: 'valiantnews.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Valuetainment',
    domain: 'valuetainment.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Washington Examiner',
    domain: 'washingtonexaminer.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Washington Free Beacon',
    domain: 'freebeacon.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Watchdog Report',
    domain: 'watchdogreport.org',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WBAP – 820AM – Dallas',
    domain: 'wbap.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Weasel Zippers',
    domain: 'weaselzippers.us',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Western Standard',
    domain: 'westernstandard.news',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WFNC – 640 AM – Fayetteville',
    domain: 'wfnc640am.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WGOW – 1150AM – Chattanooga',
    domain: 'wgowam.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WHLD – 1270AM – Buffalo',
    domain: 'talk1270.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WikiIslam',
    domain: 'wikiislam.net',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WLS – 890AM – Chicago',
    domain: 'wlsam.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'World Israel News',
    domain: 'worldisraelnews.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'World Magazine',
    domain: 'world.wng.org',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WOSH – 1490AM – Appleton',
    domain: '1490wosh.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WTMA – 1250AM – Charleston',
    domain: 'wtma.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Yellow Hammer News',
    domain: 'yellowhammernews.com',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Young Americas Foundation (YAF)',
    domain: 'yaf.org',
    bias_labels: [
      {
        label: 'right',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: '2nd Amendment Daily News',
    domain: 'secondamendmentdaily.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: '100% Fed up',
    domain: '100percentfedup.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: '2020 Conservative',
    domain: '2020conservative.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'A Voice for Men',
    domain: 'avoiceformen.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'ABQ Times',
    domain: 'abqtimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Activist Mommy',
    domain: 'activistmommy.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Ada Reporter',
    domain: 'adareporter.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Adams County Times',
    domain: 'adamscountytimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Aguascalientes Daily Post',
    domain: 'aguascalientesdailypost.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Al Arabiya',
    domain: 'english.alarabiya.net',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Albany Standard',
    domain: 'albanystandard.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Al Bawaba',
    domain: 'albawaba.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'All News Pipeline',
    domain: 'allnewspipeline.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Alliance Defending Freedom',
    domain: 'adflegal.org',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Al Manar',
    domain: 'english.almanar.com.lb',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Aloha State News',
    domain: 'alohastatenews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Alpha News',
    domain: 'alphanewsmn.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Al Youm Al Sabea',
    domain: 'youm7.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'America First Report',
    domain: 'americafirstreport.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'America Out Loud',
    domain: 'americaoutloud.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'American Action News',
    domain: 'americanactionnews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'American Catholic Tribune',
    domain: 'americancatholictribune.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'American College of Pediatricians',
    domain: 'acpeds.org',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'American Conservative Movement',
    domain: 'americanconservativemovement.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'American Family Association',
    domain: 'afa.net',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'American Family News',
    domain: 'afn.net',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'American Freedom Fighters',
    domain: 'americasfreedomfighters.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'American Gulag',
    domain: 'americangulag.org',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'American Liberty Report',
    domain: 'americanlibertyreport.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'American Lookout',
    domain: 'americanlookout.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'American Media Periscope',
    domain: 'americanmediaperiscope.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'American Partisan',
    domain: 'americanpartisan.org',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'American Patriot Daily',
    domain: 'americanpatriotdaily.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'American People Daily',
    domain: 'americanpeopledaily.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'American Pharmacy News',
    domain: 'americanpharmacynews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'American Principles Project',
    domain: 'americanprinciplesproject.org',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'American Renaissance Magazine',
    domain: 'amren.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'American Security News',
    domain: 'americansecuritynews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'American Society for the Defense of Tradition, Family, and Property',
    domain: 'tfp.org',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'American Thinker',
    domain: 'americanthinker.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'American Web Media (AWM)',
    domain: 'awm.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Americans Are Pissed',
    domain: 'americansarepissed.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'America’s News Source',
    domain: 'americasnewssource.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Ames Today',
    domain: 'amestoday.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Amoskeag Times',
    domain: 'amoskeagtimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Analyzing America',
    domain: 'analyzingamerica.org',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Anderson Reporter',
    domain: 'andersonreporter.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Ann Arbor Times',
    domain: 'annarbortimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Anne Arundel Today',
    domain: 'annearundeltoday.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Anoka Times',
    domain: 'anokatimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Anonymous Wire',
    domain: 'anonymouswire.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Antelope Valley Today',
    domain: 'antelopevalleytoday.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Arab News',
    domain: 'arabnews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Archaeology World',
    domain: 'archaeology-world.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Arizona Independent',
    domain: 'arizonaindependent.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Arizona Sun Times',
    domain: 'arizonasuntimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Aroostook News',
    domain: 'aroostooknews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Asheville Reporter',
    domain: 'ashevillereporter.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Association of American Physicians and Surgeons (AAPS)',
    domain: 'aapsonline.org',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Athens Reporter',
    domain: 'athensreporter.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Atlantic County Times',
    domain: 'atlanticcotimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'ATL Standard',
    domain: 'atlstandard.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Auburn Times',
    domain: 'auburntimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Augusta-Richmond Herald',
    domain: 'augustarichmondherald.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Baja California Post',
    domain: 'bajacaliforniapost.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Baldwin Times',
    domain: 'baldwintimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Baltimore City Wire',
    domain: 'baltimorecitywire.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Bare Naked Islam',
    domain: 'barenakedislam.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Basnews Agency',
    domain: 'basnews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Baton Rouge Reporter',
    domain: 'batonrougereporter.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Battle Creek Times',
    domain: 'battlecreektimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Bay State News',
    domain: 'baystatenews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'BB4SP',
    domain: 'bb4sp.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Bbarta24',
    domain: 'en.bbarta24.net',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Beach Broadcast News',
    domain: 'beachbroadcastnews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Bean Town Times',
    domain: 'beantowntimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Becker News',
    domain: 'beckernews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Before It’s News',
    domain: 'beforeitsnews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Beijing Review',
    domain: 'bjreview.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Benton Times',
    domain: 'bentontimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Big Island Times',
    domain: 'bigislandtimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Big League Politics',
    domain: 'bigleaguepolitics.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Big Sky Times',
    domain: 'bigskytimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Bipartisan Report',
    domain: 'bipartisanreport.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'BitChute',
    domain: 'bitchute.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Black Genocide',
    domain: 'blackgenocide.org',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Black Pigeon Speaks',
    domain: 'blackpigeonspeaks.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Bloomington Leader',
    domain: 'bloomingtonleader.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Bluegrass Times',
    domain: 'bluegrasstimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Blue State Blues News',
    domain: 'bluestatebluesnews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Blunt Force Truth',
    domain: 'bluntforcetruth.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Boise City Wire',
    domain: 'boisecitywire.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Boston Broadside',
    domain: 'bostonbroadside.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Bowling Green Today',
    domain: 'bowlinggreentoday.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Bossip',
    domain: 'bossip.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Branson Times',
    domain: 'bransontimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Breaking911',
    domain: 'breaking911.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Breaking Christian News',
    domain: 'breakingchristiannews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Breaking First',
    domain: 'breakingfirst.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Breitbart',
    domain: 'breitbart.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Brevard Sun',
    domain: 'brevardsun.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Bridgeport Times',
    domain: 'bridgeporttimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Bristol Reporter',
    domain: 'bristolreporter.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Bucks County Standard',
    domain: 'buckscountystandard.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Buffalo Ledger',
    domain: 'buffaloledger.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Burlington Reporter',
    domain: 'burlingtonreporter.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Burlington Review',
    domain: 'burlingtonreview.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Business Day Nigeria',
    domain: 'businessday.ng',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Buzzloving',
    domain: 'buzzloving.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'ByoBlu',
    domain: 'byoblu.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Cabarrus Today',
    domain: 'cabarrustoday.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Caixin Global',
    domain: 'caixinglobal.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Caldron Pool',
    domain: 'caldronpool.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Campeche Post',
    domain: 'campechepost.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Canada Free Press',
    domain: 'canadafreepress.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Cancun Post',
    domain: 'thecancunpost.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Cap News',
    domain: 'cap-news.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Cape Cod Ledger',
    domain: 'capecodledger.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Capital District Times',
    domain: 'capitaldistricttimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Capitol News',
    domain: 'micapitolnews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Cape News',
    domain: 'capemonews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Capstone Report',
    domain: 'capstonereport.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Carbondale Reporter',
    domain: 'carbondalereporter.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Catholic Tribune – Arizona',
    domain: 'azcatholictribune.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Catholic Tribune – Florida',
    domain: 'flcatholictribune.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Catholic Tribune – Michigan',
    domain: 'micatholictribune.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Catholic Tribune – Minnesota',
    domain: 'mncatholictribune.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Catholic Tribune – Pennsylvania',
    domain: 'pacatholictribune.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Catholic Tribune – Wisconsin',
    domain: 'wicatholictribune.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Causeur',
    domain: 'causeur.fr',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'CCTV International (CCTV-9)',
    domain: 'english.cctv.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'CDA Reporter',
    domain: 'cdareporter.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Cedar Rapids Today',
    domain: 'cedarrapidstoday.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Centennial State News',
    domain: 'centennialstatenews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Center for Immigration Studies',
    domain: 'trueactivist.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Center for Security Policy',
    domain: 'centerforsecuritypolicy.org',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Central Broward News',
    domain: 'centralbrowardnews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Central Colorado News',
    domain: 'centralcoloradonews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Central Florida Post',
    domain: 'centralfloridapost.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Central Georgia News',
    domain: 'centralgeorgianews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Central Idaho Times',
    domain: 'centralidahotimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Central Iowa Times',
    domain: 'centraliowatimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Central Louisiana News',
    domain: 'centrallousiananews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Central Missouri News',
    domain: 'centralmissourinews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Central Montana Times',
    domain: 'centralmontanatimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Central OC Times',
    domain: 'centraloctimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Central Pennsylvania Times',
    domain: 'centralpatimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Central STL News',
    domain: 'centralstlnews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Cerno (Cernovich.com)',
    domain: 'cernovich.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Chambana Sun',
    domain: 'chambabasun.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Channel One Russia',
    domain: '1tv.ru',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Chapel Hill Review',
    domain: 'chapelhillreview.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Chicago City Wire',
    domain: 'chicagocitywire.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Chico Times',
    domain: 'chicotimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'China Daily',
    domain: 'chinadaily.com.cn',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'China Global Television Network',
    domain: 'america.cgtn.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Christian Action Network',
    domain: 'christianaction.org',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Church Militant',
    domain: 'churchmilitant.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'CitizenGo',
    domain: 'citizengo.org',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Citizens Journal',
    domain: 'citizensjournal.us',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Clarion Project',
    domain: 'clarionproject.org',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Clash Daily',
    domain: 'clashdaily.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Clay County Times',
    domain: 'claycotimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Clay Reporter',
    domain: 'clayreporter.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'CNS News',
    domain: 'cnsnews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Coachella Today',
    domain: 'coachellatoday.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Coastal GA News',
    domain: 'coastalganews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Cobb News',
    domain: 'cobbnewsga.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Cobb Reporter',
    domain: 'cobbreporter.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Coconino News',
    domain: 'coconinonews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Colorado Free Press',
    domain: 'coloradofreepress.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Columbia News',
    domain: 'columbianews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Columbus News',
    domain: 'colonews.org',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Columbus Standard',
    domain: 'columbusstandard.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Competitive Enterprise Institute',
    domain: 'cei.org',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Concerned Women for America',
    domain: 'concernedwomen.org',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Concord Ledger',
    domain: 'concordledger.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Congressional Agenda',
    domain: 'congressionalagenda.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Connecticut Centinal',
    domain: 'connecticutsentinal.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Connecticut Star',
    domain: 'theconnecticutstar.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Conservapedia',
    domain: 'conservapedia.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Conservative Ammo',
    domain: 'conservativeammo.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Conservative Beaver',
    domain: 'conservativebeaver.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Conservative Choice Campaign',
    domain: 'conservativechoicecampaign.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Conservative Daily News',
    domain: 'conservativedailynews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Conservative Daily Post',
    domain: 'conservativedailypost.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Conservative Firing Line',
    domain: 'conservativefiringline.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Conservative Free Press',
    domain: 'conservativefreepress.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Conservative Matrix',
    domain: 'conservativematrix.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Conservative Playlist',
    domain: 'conservativeplaylist.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Conservative Post',
    domain: 'conservativepost.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Conservative Revival',
    domain: 'conservativerevival.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Conservative Tribune',
    domain: 'westernjournal.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Conservative Underground News',
    domain: 'conservativeundergroundnews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Constitution State News',
    domain: 'constitutionstatenews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Cornhusker State News',
    domain: 'cornhuskerstatenews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Corona Transition',
    domain: 'corona-transition.org',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Council for American-Islamic Relations (CAIR)',
    domain: 'cair.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Council for the National Interest',
    domain: 'councilforthenationalinterest.org',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'CovertAction Magazine',
    domain: 'covertactionmagazine.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'CovidAnalysis Network',
    domain: 'c19early.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Cowger Nation',
    domain: 'cowgernation.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Creative Destruction Media – CD Media',
    domain: 'creativedestructionmedia.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Cultural Action Party of Canada',
    domain: 'capforcanada.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Culture Watch News',
    domain: 'culturewatchnews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Current Science Daily',
    domain: 'currentsciencedaily.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Dagospia',
    domain: 'dagospia.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Daily Buzz Live',
    domain: 'dailybuzzlive.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Daily Citizen',
    domain: 'dailycitizen.focusonthefamily.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Daily Headlines',
    domain: 'dailyheadlines.net',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Daily Mail',
    domain: 'dailymail.co.uk',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Daily Political Newswire',
    domain: 'dailypoliticalnewswire.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Daily Star UK',
    domain: 'dailystar.co.uk',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Daily Stormer',
    domain: 'dailystormer.name',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Daily Surge',
    domain: 'dailysurge.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Dakota Times',
    domain: 'dakotatimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Daily Veracity',
    domain: 'dailyveracity.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Darntons',
    domain: 'darntons.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'DC Dirty Laundry',
    domain: 'dcdirtylaundry.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'DEBKAfile',
    domain: 'debka.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Decatur Times',
    domain: 'decaturtimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Deep Left Field',
    domain: 'deepleftfield.info',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Deep State Journal',
    domain: 'deepstatejournal.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Def-Con News',
    domain: 'defconnews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Defending The Republic',
    domain: 'defendingtherepublic.org',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Defiant America',
    domain: 'defiantamerica.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'DeKalb GA News',
    domain: 'dekalbganews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'DeKalb Times',
    domain: 'dekalbtimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Delaware Valley Sun',
    domain: 'delawarevalleysun.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Democratic National Committee (DNC)',
    domain: 'democrats.org',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Denver City Wire',
    domain: 'denvercitywire.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Deplorable Kel',
    domain: 'deplorablekel.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Des Moines Sun',
    domain: 'desmoinessun.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'DeSantis Daily',
    domain: 'desantisdaily.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Detroit City Wire',
    domain: 'detroitcitywire.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Discern Report',
    domain: 'discernreport.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Disclose TV',
    domain: 'disclose.tv',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Discover the Networks',
    domain: 'discoverthenetworks.org',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Disntr',
    domain: 'disntr.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'DJHJ Media',
    domain: 'djhjmedia.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'DNyuz',
    domain: 'dnyuz.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Down East Times',
    domain: 'downeasttimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Down River Today',
    domain: 'downrivertoday.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Druthers',
    domain: 'druthers.net',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Dubuque Times',
    domain: 'dubuquetimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Dupage Policy Journal',
    domain: 'dupagepolicyjournal.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Durango Post',
    domain: 'durangopost.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Durham Reporter',
    domain: 'durhamreporter.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Duval Times',
    domain: 'duvaltimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Eagle Rising',
    domain: 'eaglerising.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Eagle Valley Times',
    domain: 'eaglevalleytimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'East Alameda News',
    domain: 'eastalamedanews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'East Arapahoe News',
    domain: 'eastarapahoenews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'East Arizona News',
    domain: 'eastarizonanews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'East Central Alabama News',
    domain: 'ecalabamanews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'East Central Reporter',
    domain: 'eastcentralreporter.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'East Contra Costa News',
    domain: 'eastcontracostanews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'East Hillsborough News',
    domain: 'easthillsboroughnews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'East Hudson Valley News',
    domain: 'easthudvalleynews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'East Idaho Times',
    domain: 'eastidahotimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'East Indy News',
    domain: 'eastindynews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'East Iowa News',
    domain: 'eciowanews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'East Kentucky Times',
    domain: 'eastkentuckytimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'East Lake Norman News',
    domain: 'eastlakenormannews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'East Little Rock Times',
    domain: 'eastlittlerocktimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'East Louisville News',
    domain: 'eastlouisvillenews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'East Michigan News',
    domain: 'eastmichigannews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'East New Mexico News',
    domain: 'eastnewmexiconews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'East Panhandle News',
    domain: 'eastpanhandlenews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'East Pennyroyal News',
    domain: 'eastpennyroyalnews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'East San Diego News',
    domain: 'eastsandiegonews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'East SBV Times',
    domain: 'eastsbvtimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'East SFV Today',
    domain: 'eastsfvtoday.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'East Sierra News',
    domain: 'eastsierranews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Easton Gazette',
    domain: 'eastongazette.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'East Twin Cities',
    domain: 'easttwincities.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'East Ventura News',
    domain: 'eastventuranews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'East Volusia News',
    domain: 'eastvolusianews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'East Wake Times',
    domain: 'eastwaketimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'East Witchita Times',
    domain: 'eastwitchitatimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Eastern Wayne Today',
    domain: 'easternwaynetoday.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'eBaum’s World',
    domain: 'ebaumsworld.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Echo Check',
    domain: 'echocheck.org',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'EC Georgia News',
    domain: 'ecgeorgianews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'EC Indiana News',
    domain: 'ecindiananews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'EC Kansas News',
    domain: 'eckansasnews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'EC Mississippi News',
    domain: 'ecmissnews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'EC Nebraska News',
    domain: 'ecnebraskanews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'EC North Carolina News',
    domain: 'ecnorthcarolinanews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Education Daily Wire',
    domain: 'educationdailywire.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Elizabethtown Times',
    domain: 'elizabethtowntimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Elkhart Times',
    domain: 'elkharttimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Emerald Coast Times',
    domain: 'emeraldcoasttimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Emirates 24/7',
    domain: 'emirates247.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Empire State Today',
    domain: 'empirestatetoday.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'En-volve',
    domain: 'en-volve.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Enchantment State News',
    domain: 'enchantmentstatenews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'End the Fed',
    domain: 'endthefed.org',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Europe-Israel News',
    domain: 'europe-israel.org',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Everett Times',
    domain: 'everetttimes.com)',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Everytown for Gun Safety',
    domain: 'everytown.org',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Evie Magazine',
    domain: 'eviemagazine.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Fact Checking Turkey',
    domain: 'factcheckingturkey.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Fairport Educational Alliance',
    domain: 'fairporteducationalalliance.org',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Family Research Council',
    domain: 'frc.org',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Family Survival Headlines',
    domain: 'familysurvivalheadlines.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Farm Insurance News',
    domain: 'farminsurancenews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Fars News Agency',
    domain: 'farsnews.ir',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Fash the Nation',
    domain: 'fashthenation.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Fayetteville Standard',
    domain: 'fayettevillestandard.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Fayetteville Today',
    domain: 'fayettevilletoday.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'FDA Health News',
    domain: 'fdahealthnews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'FDA Reporter',
    domain: 'fdareporter.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Federalist Press',
    domain: 'federalistpress.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Femalista',
    domain: 'femalista.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Filming Cops',
    domain: 'filmingcops.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Finger Lakes Today',
    domain: 'fingerlakestoday.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'First in Freedom Daily',
    domain: 'firstinfreedomdaily.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'First State Times',
    domain: 'firststatetimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Flag & Cross',
    domain: 'flagandcross.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Flashout',
    domain: 'thecareerbg.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Flex Mag',
    domain: 'usafortrumponline.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Florida Capital Star',
    domain: 'floridacapitalstar.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Florida Parish News',
    domain: 'floridaparishnews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Focus on the Family',
    domain: 'focusonthefamily.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Foothills Review',
    domain: 'foothillsreview.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Forbidden News Network',
    domain: 'bannedbook.org',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Foreign Policy Initiative',
    domain: 'foreignpolicyi.org',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'For the Right News',
    domain: 'fortherightnews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Fort Smith Times',
    domain: 'fortsmithtimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Fox News',
    domain: 'foxnews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'FR24 News',
    domain: 'fr24news.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Frank Speech',
    domain: 'frankspeech.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Freedom First Network',
    domain: 'freedomfirstnetwork.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Freedom News Report',
    domain: 'freedomnewsreport.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Free-Speech Front',
    domain: 'free-speechfront.info',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Free West Media',
    domain: 'freewestmedia.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Fresno Leader',
    domain: 'fresnoleader.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Fria Tider (Free Times)',
    domain: 'friatider.se',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'FrontPage Magazine',
    domain: 'frontpagemag.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Frontpage Newspaper',
    domain: 'frontpagenewspaper.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'FT Wayne Times',
    domain: 'ftwaynetimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'GAB News',
    domain: 'news.gab.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Gadsden Today',
    domain: 'gadsdentoday.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Galesburg Reporter',
    domain: 'galesburgreporter.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Garden State Times',
    domain: 'gardenstatetimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Gastonia Times',
    domain: 'gastoniatimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Gatestone Institute',
    domain: 'gatestoneinstitute.org',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'GB News UK',
    domain: 'gbnews.uk',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Geller Report',
    domain: 'pamelageller.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Gem State Wire',
    domain: 'gemstatewire.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Genesee News',
    domain: 'geneseenews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Gen Z Conservative',
    domain: 'genzconservative.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Geology In',
    domain: 'geologyin.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Georgia Mountain News',
    domain: 'georgiamountainnews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Georgia Record',
    domain: 'georgiarecord.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Georgia Star News',
    domain: 'georgiastarnews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'GETTR',
    domain: 'gettr.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Girls Just Wanna Have guns',
    domain: 'girlsjustwannahaveguns.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'GiveSendGo',
    domain: 'givesendgo.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Glacier Country News',
    domain: 'glaciercountrynews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Globe Magazine',
    domain: 'globemagazine.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Gloucester Today',
    domain: 'gloucestertoday.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Gnews',
    domain: 'gnews.org',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Gold Country Today',
    domain: 'goldcountrytoday.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Golden State Today',
    domain: 'goldenstatetoday.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'GoodGopher',
    domain: 'goodgopher.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'GOP Daily Brief',
    domain: 'gopdailybrief.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Gop.gov House Republicans',
    domain: 'gop.gov',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'GOPUSA',
    domain: 'gopusa.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Grand Canyon Times',
    domain: 'grandcanyontimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Grand Junction Times',
    domain: 'grandjunctiontimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Grand Rapids News',
    domain: 'grandrapidsminews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Grand Rapids Reporter',
    domain: 'grandrapidsreporter.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Granma (Cuba)',
    domain: 'en.granma.cu',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Great American Daily',
    domain: 'greatamericandaily.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Great Lakes Wire',
    domain: 'greatlakeswire.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'GreatReject',
    domain: 'greatreject.org',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Greensboro Reporter',
    domain: 'greensbororeporter.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Greenville Reporter',
    domain: 'greenvillereporter.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Grundy Reporter',
    domain: 'grundyreporter.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'GTR Times',
    domain: 'gtrtimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Guadalajara Post',
    domain: 'theguadalajarapost.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Guardian Nigeria',
    domain: 'guardian.ng',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Guerrero Post',
    domain: 'theguerreropost.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Gulf News',
    domain: 'gulfnews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Gunster News',
    domain: 'gunsternews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Hagmann Report',
    domain: 'hagmannreport.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Hal Turner Radio Show',
    domain: 'halturnerradioshow.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Harford News',
    domain: 'harfordnews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Hartford Reporter',
    domain: 'hartfordreporter.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Hawar News Agancy',
    domain: 'en.hawarnews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Hawkeye Reporter',
    domain: 'hawkeyereporter.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Headline USA',
    domain: 'headlineusa.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Head Topics',
    domain: 'headtopics.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Henderson Times',
    domain: 'hendersontimes.org',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Here is the Evidence',
    domain: 'hereistheevidence.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Hernando Reporter',
    domain: 'hernandoreporter.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Heartland Institute',
    domain: 'heartland.org',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Hickory Sun',
    domain: 'hickorysun.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'High Country Times',
    domain: 'highcountrytimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Higher Education Tribune',
    domain: 'highereducationtribune.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Hillsborough Sun',
    domain: 'hillsboroughsun.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Hindustan Times',
    domain: 'hindustantimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Hogg Watch',
    domain: 'hoggwatch.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Honolulu Reporter',
    domain: 'honolulureporter.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Holland Reporter',
    domain: 'hollandreporter.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Hoosier State Today',
    domain: 'hoosierstatetoday.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Hopkinsville Times',
    domain: 'hopkinsvilletimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Hot Springs Times',
    domain: 'hotspringstimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Houma Thibodaux News',
    domain: 'houmathibodauxnews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Housatonic Valley News',
    domain: 'housatonicvalleynews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Howard County News',
    domain: 'howardconews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'HR Daily Wire',
    domain: 'hrdailywire.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Hudson Today',
    domain: 'hudsontoday.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Huntsville Leader',
    domain: 'huntsvilleleader.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Hutch Today',
    domain: 'hutchtoday.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'IBX News',
    domain: 'ibxnews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'iHarare',
    domain: 'iharare.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'I Hate the Media',
    domain: 'ihatethemedia.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'I, Hypocrite',
    domain: 'ihypocrite.net',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Illegal Alien Crime Report',
    domain: 'illegalaliencrimereport.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Illicit Info',
    domain: 'illicitinfo.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Illinois Valley Times',
    domain: 'illinoisvalleytimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Imperial CA News',
    domain: 'imperialcanews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'InfoGalactic',
    domain: 'infogalactic.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Independent Minute',
    domain: 'independentminute.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Independent Sentinel',
    domain: 'independentsentinel.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Indy Standard',
    domain: 'indystandard.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Information Liberation',
    domain: 'informationliberation.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Informer – Serbia',
    domain: 'informer.rs',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'InfoScum',
    domain: 'infoscum.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Inner Strength Zone',
    domain: 'innerstrength.zone',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Institute for Historical Review (IHR)',
    domain: 'ihr.org',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Insurance Rate Reporter',
    domain: 'insuranceratereporter.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Interior Alaska News',
    domain: 'interioralaskanews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'International Organization for the Family (IOF)',
    domain: 'profam.org',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Iowa City Today',
    domain: 'iowacitytoday.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Iowa Star',
    domain: 'theiowastar.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'iPatriot',
    domain: 'ipatriot.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Israel Unwired',
    domain: 'israelunwired.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Ivermectin for Covid-19',
    domain: 'ivmmeta.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Jackson Purchase News',
    domain: 'jacksonpurchasenews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Jefferson City News',
    domain: 'jeffcitynews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Jefferson County Times',
    domain: 'jeffcotimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Jefferson Reporter',
    domain: 'jeffersonreporter.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Joco Today',
    domain: 'jocotoday.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'John Birch Society',
    domain: 'jbs.org',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Johnston Reporter',
    domain: 'johnstonreporter.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Jonesboro Times',
    domain: 'jonesborotimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Judicial Watch',
    domain: 'judicialwatch.org',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Just the News',
    domain: 'justthenews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Kalamazoo Times',
    domain: 'kalamazootimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Kane County Reporter',
    domain: 'kanecountyreporter.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Kankakee Times',
    domain: 'kankakeetimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Katehon',
    domain: 'katehon.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Kauai Sun',
    domain: 'kauaisun.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'KC Reporter',
    domain: 'kcreporter.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Kendall County Times',
    domain: 'kendallcountytimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Kent County Today',
    domain: 'kentcountytoday.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Kentuckiana Times',
    domain: 'kentuckianatimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Kern County Times',
    domain: 'kerncountytimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Key West Reporter',
    domain: 'keywestreporter.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Kings County Times',
    domain: 'kingscountytimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Knights Templar International',
    domain: 'knightstemplarinternational.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Kokomo Standard',
    domain: 'kokomostandard.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'LA Crosse Leader',
    domain: 'lacrosseleader.org',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Lafayette Reporter',
    domain: 'lafayettereporter.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Lafayette Times',
    domain: 'lafayettetimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'LA Harbor News',
    domain: 'laharbornews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Lake County Gazette',
    domain: 'lakecountygazette.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Lake Region News',
    domain: 'lakeregionnews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Lake Tahoe Sun',
    domain: 'laketahoesun.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Lancaster Courier',
    domain: 'lancastercourier.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Lansing Sun',
    domain: 'lansingsun.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Larimer News',
    domain: 'larimernews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Last Frontier News',
    domain: 'lastfrontiernews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Las Vegas City Wire',
    domain: 'lasvegascitywire.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Lawrence Reporter',
    domain: '0.0.0.11',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'LAX Leader',
    domain: 'laxleader.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Leading Report',
    domain: 'theleadingreport.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Left Action',
    domain: 'leftaction.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Legal Newsline',
    domain: 'legalnewsline.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Lehigh Valley News',
    domain: 'lehighnews.org',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Lewiston Times',
    domain: 'lewistontimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Lew Rockwell',
    domain: 'lewrockwell.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Liberty Bell',
    domain: 'libertybell.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Liberty Hangout',
    domain: 'libertyhangout.org',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Liberty News',
    domain: 'libertynews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Liberty Talk.fm',
    domain: 'libertytalk.fm',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Liberty Wire',
    domain: 'libertywire.net',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Libs of TikTok',
    domain: 'libsoftiktok.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Life News',
    domain: 'lifenews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Life Site News',
    domain: 'lifesitenews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Lifezette',
    domain: 'lifezette.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Lindell TV',
    domain: 'lindelltv.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Litchfield Hills Today',
    domain: 'litchfieldhillstoday.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Little Apple Times',
    domain: 'littleappletimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Livingston Today',
    domain: 'livingstonetoday.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Live Leak',
    domain: 'liveleak.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'London Web News',
    domain: 'londonwebnews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Louder with Crowder',
    domain: 'louderwithcrowder.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Louisville City Wire',
    domain: 'louisvillecitywire.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Lowe Delta News',
    domain: 'lowedeltanews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Macomb Journal',
    domain: 'macombjournal.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Macomb Today',
    domain: 'macombtoday.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Macon Reporter',
    domain: 'maconreporter.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Macon Times',
    domain: 'macontimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Magic Valley Times',
    domain: 'magicvalleytimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Magnolia State News',
    domain: 'magnoliastatenews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Maine Daily News',
    domain: 'mainedailynews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Maine Highlands News',
    domain: 'mainehighlandsnews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Maine Lakes News',
    domain: 'mainelakesnews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Mainstream Fake Media',
    domain: 'mainstreamfakemedia.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Manatee Review',
    domain: 'manateereview.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Manila Business Daily',
    domain: 'manilabusinessdaily.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Marin Leader',
    domain: 'marinleader.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Maryland Business Daily',
    domain: 'mdbusinessdaily.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Maryland State Wire',
    domain: 'mdstatewire.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Massachusetts Business Daily',
    domain: 'mabusinessdaily.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Mat-Su',
    domain: 'matsutimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Maui Reporter',
    domain: 'mauireporter.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Mazatlan Post',
    domain: 'themazatlanpost.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'McHenry Times',
    domain: 'mchenrytimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'McLean County Times',
    domain: 'mcleancountytimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Mecklenburg Herald',
    domain: 'mecklenburgherald.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Mehr News Agency',
    domain: 'en.mehrnews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Merced Times',
    domain: 'mercedtimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Mercer Times',
    domain: 'mercertimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Mercopress',
    domain: 'en.mercopress.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Merrimack Valley News',
    domain: 'merrimackvalleynews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Mesa Times',
    domain: 'mesatimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Metapedia',
    domain: 'en.metapedia.org',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Metric Media',
    domain: 'metricmedianews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Metro East Sun',
    domain: 'metroeastsun.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Metro Lex News',
    domain: 'metrolexnews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Metro West Times',
    domain: 'metrowesttimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Mexico Business Daily',
    domain: 'mexicobusinessdaily.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Mexico City Post',
    domain: 'themexicocitypost.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Mexico Daily Post',
    domain: 'mexicodailypost.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Miami Courant',
    domain: 'miamicourant.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Miami Standard',
    domain: 'miamistandard.news',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Mic Drop Politics',
    domain: 'micdroppolitics.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Michigan Business Daily',
    domain: 'mibusinessdaily.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Michigan Star',
    domain: 'themichiganstar.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Mid Coast Today',
    domain: 'midcoasttoday.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Middle East Forum',
    domain: 'meforum.org',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Middle East News Agency',
    domain: 'mena.org.eg',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Middle East Media Research Institute (Memri)',
    domain: 'memri.org',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Mid Massachusetts News',
    domain: 'midmassnews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Mid Michigan Standard',
    domain: 'midmichiganstd.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Mile High Sentinel',
    domain: 'milehighsentinel.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Military Review',
    domain: 'topwar.ru',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Military Watch Magazine',
    domain: 'militarywatchmagazine.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Milwaukee Metro Times',
    domain: 'milwaukeemetrotimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Minneapolis Review',
    domain: 'minneapolisreview.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Minnesota Business Daily',
    domain: 'mnbusinessdaily.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Minnesota State Wire',
    domain: 'minnesotastatewire.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Minnesota Sun',
    domain: 'theminnesotasun.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Mint Press News',
    domain: 'mintpressnews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Mississippi Business Daily',
    domain: 'msbusinessdaily.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Mississippi Gulf News',
    domain: 'msgulfnews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Missouri Business Daily',
    domain: 'mobusinessdaily.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Mixi.Media',
    domain: 'mixi.media',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Mobile Courant',
    domain: 'mobilecourant.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Mohave Today',
    domain: 'mohavetoday.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Mohawk Valley Times',
    domain: 'mohawkvalleytimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Moms For Liberty',
    domain: 'momsforliberty.org',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Mondoweiss',
    domain: 'mondoweiss.net',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Monmouth Times',
    domain: 'monmouthtimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Monroe NY News',
    domain: 'monroenynews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Monroe Review',
    domain: 'monroereview.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Montana Business Daily',
    domain: 'mybusinessdaily.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Monterey Times',
    domain: 'montereytimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Monterrey Daily Post',
    domain: 'monterreydailypost.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Montgomery News',
    domain: 'montgomerymdnews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'MoonBattery',
    domain: 'moonbattery.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Moon of Alabama',
    domain: 'moonofalabama.org',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Morelos Daily Post',
    domain: 'morelosdailypost.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Morning Poll',
    domain: 'morningpoll.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Morris Leader',
    domain: 'morrisleader.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'MoveOn',
    domain: 'front.moveon.org',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'MTO News',
    domain: 'mtonews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Muncie Reporter',
    domain: 'munciereporter.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Muskegon Sun',
    domain: 'muskegonsun.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Mutembei TV –',
    domain: 'mutembeitv.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Nw Iowa News',
    domain: 'nwiowanews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'New Jersey Business Daily',
    domain: 'njbusinessdaily.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Nantahala News',
    domain: 'nantahalanews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Naples Standard',
    domain: 'naplesstandard.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Nassau Standard',
    domain: 'nassaustandard.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Nature Coast Times',
    domain: 'naturecoasttimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'National Alliance',
    domain: 'natall.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'National Enquirer',
    domain: 'nationalenquirer.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'National Insiders',
    domain: 'nationalinsiders.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'National Rifle Association',
    domain: 'home.nra.org',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'National Right to Life Committee',
    domain: 'nrlc.org',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'National Vanguard',
    domain: 'nationalvanguard.org',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'National Zero',
    domain: 'nationalzero.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Nation and State',
    domain: 'nationandstate.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Natural State News',
    domain: 'naturalstatenews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Naugatuck Times',
    domain: 'naugatucktimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'NC Florida News',
    domain: 'ncfloridanews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'NC Georgia News',
    domain: 'ncgeorgianews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'NC Kansas News',
    domain: 'nckansasnews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'NC Indiana News',
    domain: 'ncindiananews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'NC Kentucky News',
    domain: 'nckentuckynews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'NC Massachusetts News',
    domain: 'ncmassnews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'NC Minnesota News',
    domain: 'ncminnesotanews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'NC Mississippi News',
    domain: 'ncmissnews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'NE Alabama News',
    domain: 'nealabamanews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'NE Atlanta News',
    domain: 'neatlantanews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'NE Bergen News',
    domain: 'nebergennews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Nebraska Business Daily',
    domain: 'nebraskabusinessdaily.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Nebraska Panhandle News',
    domain: 'nepanhandlenews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'NE Cali News',
    domain: 'necalinews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'NE Colorado News',
    domain: 'necoloradonews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'NE Connecticut News',
    domain: 'neconnnews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'NE Florida News',
    domain: 'nefloridanews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'NE Indiana News',
    domain: 'neindiananews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'NE Iowa News',
    domain: 'neiowanews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'NE Kansas City News',
    domain: 'nekansascitynews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'NE Kansas News',
    domain: 'nekansasnews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'NE Kentucky News',
    domain: 'nekentuckynews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'NE Louisiana News',
    domain: 'nelouisiananews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'NE Mississippi News',
    domain: 'nemissnews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'NE Missouri News',
    domain: 'nemissourinews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'NE Nebraska News',
    domain: 'nenebraskanews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'NE New Mexico News',
    domain: 'nenewmexiconews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'NE New York Today',
    domain: 'nenewyorktoday.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'NE Sacramento News',
    domain: 'nesacramentonews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'NE Valley Times',
    domain: 'nevalleytimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'NEO – New Eastern Outlook',
    domain: 'journal-neo.org',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Nevada Business Daily',
    domain: 'nvbusinessdaily.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Newark Reporter',
    domain: 'newarkreporter.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'New Hampshire Business Daily',
    domain: 'nhbusinessdaily.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'New Mexico Business Daily –',
    domain: 'nmbusinessdaily.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'New Mexico Sun',
    domain: 'newmexicosun.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'New Nation News',
    domain: 'newnation.org',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'News18-India',
    domain: 'news18.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'News Blaze',
    domain: 'newsblaze.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'News Break',
    domain: 'newsbreak.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'News Global',
    domain: 'newsglobal.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'News Heist',
    domain: 'newsheist.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'News Hour First',
    domain: 'newshourfirst.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'News Punch',
    domain: 'newspunch.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'News Pushed',
    domain: 'newspushed.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'NewsReady',
    domain: 'newsready.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'News Rescue',
    domain: 'newsrescue.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'News Sloth',
    domain: 'newssloth.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'News with Views',
    domain: 'newswithviews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'NewsAmmo',
    domain: 'newsammo.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Newsmax',
    domain: 'newsmax.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Newsner',
    domain: 'en.newsner.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Newsview',
    domain: 'newsview.gr',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'NewsWars',
    domain: 'newswars.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'New York Business Daily',
    domain: 'nybusinessdaily.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Niagara Leader',
    domain: 'niagaraleader.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Nola Reporter',
    domain: 'nolareporter.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'No Left Turn in Education',
    domain: 'noleftturn.us',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'NOQ Report',
    domain: 'noqreport.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Nordic Monitor',
    domain: 'nordicmonitor.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Norfolk Reporter',
    domain: 'norfolkreporter.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'North Acadiana News',
    domain: 'northacadiananews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'North Alaska News',
    domain: 'northalaskanews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'North Baltimore Journal',
    domain: 'northbaltimorejournal.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'North Birmingham Times',
    domain: 'northbirminghamtimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'North Bluegrass News',
    domain: 'northbluegrassnews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'North Boston News',
    domain: 'northbostonnews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'North Broward News',
    domain: 'northbrowardnews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'North Central Arkansas News',
    domain: 'ncarkansasnews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'North Coast California News',
    domain: 'northcoastcanews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'North Cook News',
    domain: 'northcooknews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'North Country Reporter',
    domain: 'northcountryreporter.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'North DSM News',
    domain: 'northdsmnews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Northeast Herald',
    domain: 'northeastherald.org',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Northeast Montana News',
    domain: 'nemontananews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Northern Clark County Herald',
    domain: 'northernclarkcountyherald.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'North Country Leader',
    domain: 'northcountryleader.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Northern Wisconsin Times',
    domain: 'northernwitimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'North Egypt News',
    domain: 'northegyptnews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'North Essex News',
    domain: 'northessexnews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'North Fulton Today',
    domain: 'northfultontoday.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'North Gwinnett News',
    domain: 'northgwinnettnews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'North Hennepin News',
    domain: 'northhennepinnews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'North Michigan News',
    domain: 'northmichigannews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'North Idaho Times',
    domain: 'northidahotimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'North Indy News',
    domain: 'northindynews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'North Inland News',
    domain: 'northinlandnews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'North Iowa Reporter',
    domain: 'northiowareporter.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'North Jefferson County News',
    domain: 'northjeffconews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'North Kent News',
    domain: 'northkentnews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'North Kentucky News',
    domain: 'northkentuckynews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'North Lake Times',
    domain: 'northlaketimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'North Little Rock Times',
    domain: 'northlittlerocktimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'North Miami-Dade News',
    domain: 'northmianews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'North Middlesex Times',
    domain: 'northmiddlesextimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'North Nevada News',
    domain: 'northnevadanews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'North OC Times',
    domain: 'northoctimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'North Omaha Times',
    domain: 'northomahatimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'North Orlando News',
    domain: 'northorlandonews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'North Palm Beach Today',
    domain: 'northpalmbeachtoday.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'North Panhandle News',
    domain: 'northpanhandlenews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'North Pima News',
    domain: 'northpimanews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'North Pinellas News',
    domain: 'northpinellasnews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'North Ramsey News',
    domain: 'northramseynews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'North Sacramento Today',
    domain: 'northsactoday.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'North New Castle News',
    domain: 'northnewcastlenews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'North SFV Today',
    domain: 'northsfvtoday.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'North SGV News',
    domain: 'northsgvnews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'North Shore Louisiana News',
    domain: 'northshorelanews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'North STL News',
    domain: 'northstlnews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'North Vegas Times',
    domain: 'northvegastimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Northwest Montana News',
    domain: 'nwmontananews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Northwest Wayne News',
    domain: 'nwwaynenews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Northwest Lake Times',
    domain: 'nwlaketimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'North Wichita News',
    domain: 'northwichitanews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Novi Times',
    domain: 'novitimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Now8News',
    domain: 'now8news.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'NowThisNews',
    domain: 'nowthisnews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'NRL News Today',
    domain: 'nationalrighttolifenews.org',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'NTD.TV (New Tang Dynasty)',
    domain: 'ntd.tv',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'NW Alabama News',
    domain: 'nwalabamanews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'NW Arkansas News',
    domain: 'nwarkansasnews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'NW Atlanta News',
    domain: 'nwatlantanews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'NW Bergen News',
    domain: 'nwbergennews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'NW Connecticut News',
    domain: 'nwconnnews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'NW Clark News',
    domain: 'nwclarknews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'NW Georgia News',
    domain: 'nwgeorgianews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'NW Illinois News',
    domain: 'nwillinoisnews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'NW Jersey News',
    domain: 'nwjerseynews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'NW Kansas News',
    domain: 'nwkansasnews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'NW Kentucky News',
    domain: 'nwkentuckynews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'NW LA Times',
    domain: 'nwlatimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'NW Louisiana News',
    domain: 'nwlouisiananews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'NW Minnesota News',
    domain: 'nwminnesotanews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'NW Mississippi News',
    domain: 'nwmissnews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'NW Missouri Times',
    domain: 'nwmissouritimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'NW New Mexico News',
    domain: 'nwnewmexiconews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'NW Riverside News',
    domain: 'nwriversidenews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'NW Valley Times',
    domain: 'nwvalleytimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'NYC Gazette',
    domain: 'nycgazette.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'My Daily Freedom',
    domain: 'mydailyfreedom.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Oakland City Wire',
    domain: 'oaklandcitywire.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Oakland Times',
    domain: 'oaklandtimes.org',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Oaxaca Post',
    domain: 'theoaxacapost.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Objectivist',
    domain: 'objectivist.co',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Ocala Standard',
    domain: 'ocalastandard.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Occupy Democrats',
    domain: 'occupydemocrats.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Ocean County Leader',
    domain: 'oceancountyleader.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Okeechobee Times',
    domain: 'okeechobeetimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'O’Keefe Media Group',
    domain: 'okeefemediagroup.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Oneida Times',
    domain: 'oneidatimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Origo',
    domain: 'origo.hu',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Orlando Standard',
    domain: 'orlandostandard.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'OTP Tribune',
    domain: 'otptribune.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Outraged Patriot',
    domain: 'outragedpatriot.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Overpasses for America',
    domain: 'overpassesforamerica.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Oxford Reporter',
    domain: 'oxfordreporter.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Pacific Pundit',
    domain: 'pacificpundit.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Palm Coast Times',
    domain: 'palmcoasttimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Panama City Reporter',
    domain: 'panamacityreporter.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Parler',
    domain: 'parler.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Pasco Reporter',
    domain: 'pascoreporter.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Passaic Today',
    domain: 'passaictoday.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Patient Daily',
    domain: 'patientdaily.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Patriot Fetch',
    domain: 'patriotfetch.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Patriot Journal',
    domain: 'patriotjournal.org',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Patriotic Post',
    domain: 'patrioticpost.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Patriot Newsfeed',
    domain: 'patriotnewsfeed.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Patriot Pulse',
    domain: 'patriotpulse.net',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Patriot Uproar',
    domain: 'patriotuproar.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Patriotic Viral News',
    domain: 'patrioticviralnews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Peachtree Gazette',
    domain: 'peachtreegazette.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Peach Tree Times',
    domain: 'peachtreetimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Pelican State News',
    domain: 'pelicanstatenews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Pennsylvania Daily Star',
    domain: 'pennsylvaniadailystar.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Pennsylvania Independent',
    domain: 'pennsylvaniaindependent.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Pensacola Times',
    domain: 'pensacolatimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Peoria Standard',
    domain: 'peoriastandard.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Perez Hilton',
    domain: 'perezhilton.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Personal Interpretation',
    domain: 'personalinterpretation.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'PHX Reporter',
    domain: 'phxreporter.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Piedmont Tribune',
    domain: 'piedmonttribune.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Pima Times',
    domain: 'pimatimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Pinal Today',
    domain: 'pinaltoday.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Pine Belt Times',
    domain: 'pinebelttimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Pinellas Times',
    domain: 'pinellastimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Pine State News',
    domain: 'pinestatenews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'PJ Media',
    domain: 'pjmedia.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Platte News',
    domain: 'plattenews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Plymouth Reporter',
    domain: 'plymouthreporter.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Pocatello Times',
    domain: 'pocatellotimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Political Animal News',
    domain: 'politicalanimalnews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'PoliticalDiscussion',
    domain: 'political-discussion.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Political Flare',
    domain: 'politicalflare.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Political Insider',
    domain: 'thepoliticalinsider.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Politifact News',
    domain: 'politifact.news',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'PolitNavigator',
    domain: 'politnavigator.net',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'PolitRussia',
    domain: 'politros.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Polk Times',
    domain: 'polktimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Pomona Valley News',
    domain: 'pomonavalleynews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Pontiac Times',
    domain: 'pontiacttimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Population Research Institute',
    domain: 'pop.org',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Portland Maine News',
    domain: 'portlandmainenews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'PragerU',
    domain: 'prageru.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Prairie State Wire',
    domain: 'prairiestatewire.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Pravda Report',
    domain: 'pravdareport.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Presidential Hill',
    domain: 'presidentialhill.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Press California',
    domain: 'presscalifornia.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Press Corp',
    domain: 'presscorp.org',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Press TV',
    domain: 'presstv.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Prntly',
    domain: 'prntly.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Project Veritas',
    domain: 'projectveritas.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Proto Thema',
    domain: 'en.protothema.gr',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Pro Trump News',
    domain: 'protrumpnews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Pulaski Times',
    domain: 'pulaskitimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Queretaro Post',
    domain: 'thequeretaropost.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Quillette',
    domain: 'quillette.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Quincy Reporter',
    domain: 'quincyreporter.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Radar',
    domain: 'radaronline.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'RAIR Foundation USA',
    domain: 'rairfoundation.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Rational Ground',
    domain: 'rationalground.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Real News Now',
    domain: 'realnewsnow.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Real Science',
    domain: 'goodsciencing.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Redacted',
    domain: 'redacted.inc',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Redding Today',
    domain: 'reddingtoday.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Red Ice TV',
    domain: 'redice.tv',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Red Orbit',
    domain: 'redorbit.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Red Right Daily',
    domain: 'redrightdaily.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Red Right Patriot',
    domain: 'redrightpatriot.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Red State Nation',
    domain: 'redstatenation.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Red State Watcher',
    domain: 'redstatewatcher.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Red Voice Media',
    domain: 'redvoicemedia.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Redwood Empire News',
    domain: 'redwoodempirenews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Reformed Media',
    domain: 'reformedmedia.net',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Renew America',
    domain: 'renewamerica.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'RenewedRight.com',
    domain: 'renewedright.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Reno Reporter',
    domain: 'renoreporter.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Republican Daily',
    domain: 'republicandaily.net',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Republican National Committee (RNC)',
    domain: 'gop.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Resist the Mainstream',
    domain: 'resistthemainsteam.org',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Restore American Glory',
    domain: 'restoreamericanglory.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'RIA Novosti',
    domain: 'ria.ru',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Righter Way',
    domain: 'righterway.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Right News Wire',
    domain: 'rightnewswire.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Right Side Broadcasting Network',
    domain: 'rsbnetwork.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Riposte Laique',
    domain: 'ripostelaique.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'River Bend Times',
    domain: 'riverbendtimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'River Parish News',
    domain: 'riverparishnews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'River Region Times',
    domain: 'riverregiontimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'River Valley Today',
    domain: 'rivervalleytoday.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Rochester Reporter',
    domain: 'rochesterreporter.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Rockford Sun',
    domain: 'rockfordsun.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Rockingham Journal',
    domain: 'rockinghamjournal.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Rockingham Times',
    domain: 'rockinghamtimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Rock Island Today',
    domain: 'rockislandtoday.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Rockland Reporter',
    domain: 'rocklandreporter.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Rock Valley Times',
    domain: 'rockvalleytimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Rogue Review',
    domain: 'roguereview.net',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Rome Reporter',
    domain: 'romereporter.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'RT DE (RT News Germany)',
    domain: 'de.rt.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'RT News',
    domain: 'rt.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Rudaw',
    domain: 'rudaw.net',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Rumble',
    domain: 'rumble.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Ruptly',
    domain: 'ruptly.tv',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Russia Insider',
    domain: 'russia-insider.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Russia News Agency-TASS',
    domain: 'tass.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Ruth Institute',
    domain: 'ruthinstitute.org',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Sacramento Standard',
    domain: 'sacramentostandard.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Salem News Wire',
    domain: 'salemnewswire.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'San Cristobal Post',
    domain: 'sancristobalpost.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Sandhills Today',
    domain: 'sandhillstoday.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'San Diego City Wire',
    domain: 'sandiegocitywire.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Sandoval News',
    domain: 'sandovalnews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'San Francisco Sun',
    domain: 'sanfransun.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Sangamon Sun',
    domain: 'sangamonsun.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'San Joaquin Times',
    domain: 'sanjoaquintimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'San Jose Standard',
    domain: 'sanjosestandard.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Santa Clara Today',
    domain: 'santaclaratoday.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Santa Cruz Standard',
    domain: 'santacruzstandard.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'San Mateo Sun',
    domain: 'sanmateosun.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Santa Fe Standard',
    domain: 'santafestandard.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Santa Monica Observer',
    domain: 'smobserved.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Sarasota Review',
    domain: 'sarasotareview.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Saratoga Standard',
    domain: 'saratogastandard.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Savannah Standard',
    domain: 'savannahstandard.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Savannah Sun Times',
    domain: 'savannahsuntimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'SC Alaska News',
    domain: 'scalaskanews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'SE Atlanta News',
    domain: 'seatlantanews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'SC Connecticut News',
    domain: 'scconnnews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'SC Kansas News',
    domain: 'sckansasnews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'SC Minnesota News',
    domain: 'scminnesotanews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'SC Mississippi News',
    domain: 'scmissnews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'SC Missouri News',
    domain: 'scmissourinews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'SC Nebraska News',
    domain: 'scnebraskanews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'SC New York News',
    domain: 'scnewyorknews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Seacoast Standard',
    domain: 'seacoaststandard.org',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'SE Alaska News',
    domain: 'sealaskanews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'SE Arizona News',
    domain: 'searizonanews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Secure America Now',
    domain: 'secureamericanow.org',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'SE Bluegrass News',
    domain: 'sebluegrassnews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'SE Colorado News',
    domain: 'secoloradonews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'SE Connecticut News',
    domain: 'seconnnews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'SE Denver News',
    domain: 'sedenvernews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Seekr',
    domain: 'seekr.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'SE Georgia News',
    domain: 'segeorgianews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'SE Grand Rapids News',
    domain: 'segrandrapids.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'SE Illinois News',
    domain: 'seillinoisnews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'SE Indiana News',
    domain: 'seindiananews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'SE Iowa News',
    domain: 'seiowanews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'SE Kansas News',
    domain: 'sekansasnews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'SE Kansas City News',
    domain: 'sekansascitynews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'SE Kentucky News',
    domain: 'sekentuckynews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'SE LA Times',
    domain: 'selatimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'SE Minnesota News',
    domain: 'seminnesotanews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'SE Missouri News',
    domain: 'semissourinews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'SE Nebraska News',
    domain: 'senebraskanews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'SE Oakland News',
    domain: 'seoaklandnews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'SE Twin Cities',
    domain: 'setwincities.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'SE Vegas News',
    domain: 'sevegasnews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'SFV Today',
    domain: 'sfvtoday.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'SGV Standard',
    domain: 'sgvstandard.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Shafaq News',
    domain: 'shafaaq.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Shelby Review',
    domain: 'shelbyreview.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Shiawassee Times',
    domain: 'shiawasseetimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Shoals Today',
    domain: 'shoalstoday.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Show-Me States Times',
    domain: 'showmestatetimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Shreveport Reporter',
    domain: 'shreveportreporter.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'SHTFplan.com',
    domain: 'shtfplan.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Sick Chirpse',
    domain: 'sickchirpse.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Silver State Times',
    domain: 'silverstatetimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Sioux City Times',
    domain: 'siouxcitytimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'SkepticInk',
    domain: 'skepticink.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Slay News',
    domain: 'slaynews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'SLO Reporter',
    domain: 'sloreporter.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Solono Sun',
    domain: 'solanosun.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Somerset Times',
    domain: 'somersettimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'South ABQ News',
    domain: 'southabqnews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'South Africa Today',
    domain: 'southafricatoday.net',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'South Alameda News',
    domain: 'southalamedanews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'South Atlanta News',
    domain: 'southatlantanews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'South Bay Leader',
    domain: 'southbayleader.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'South Bay SD News',
    domain: 'southbaysdnews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'South Bend Times',
    domain: 'southbendtimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'South Alabama Times',
    domain: 'southalabamatimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'South Bergen News',
    domain: 'southbergennews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'South Broward News',
    domain: 'southbrowardnews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'South Central Reporter',
    domain: 'southcentralreporter.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'South Cook News',
    domain: 'southcooknews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Southern Colorado Times',
    domain: 'southerncoloradotimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Southern Illinois News',
    domain: 'silnews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Southern Indiana Today',
    domain: 'southernindianatoday.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'South DSM News',
    domain: 'southdsmnews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Southeast Montana News',
    domain: 'semontananews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'SouthEastern Times',
    domain: 'southeasterntimes.org',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'South Georgia Times',
    domain: 'southgeorgiatimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'South Gwinnett News',
    domain: 'southgwinnettnews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'South Hennepin News',
    domain: 'southhennepinnews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'South Indy News',
    domain: 'southindynews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'South Iowa News',
    domain: 'southiowanews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'South Jefferson County News',
    domain: 'southjeffconews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'South Jersey Sun',
    domain: 'southjerseysun.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'South KC News',
    domain: 'southkcnews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'South Kent News',
    domain: 'southkentnews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'South Lake Today',
    domain: 'southlaketoday.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'South Louisiana News',
    domain: 'southlouisiananews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'South Maine News',
    domain: 'southmainenews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'South Miami Dade News',
    domain: 'southmianews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'South Michigan News',
    domain: 'southmichigannews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'South Middlesex Times',
    domain: 'southmiddlesextimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'South New Castle News',
    domain: 'southnewcastlenews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'South Omaha Times',
    domain: 'southomahatimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'South Orlando News',
    domain: 'southorlandonews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'South Palm Beach Today',
    domain: 'southpalmbeachtoday.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'South Pinellas Times',
    domain: 'southpinellastimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'South Sacramento Today',
    domain: 'southsactoday.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'South SF Bay News',
    domain: 'southsfbaynews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'South SGV News',
    domain: 'southsgvnews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'South STL News',
    domain: 'southstlnews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'South West Illinois News',
    domain: 'swillinoisnews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Southwest Montana News',
    domain: 'swmontanatimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'South Wichita News',
    domain: 'southwichitanews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Springfield City Wire',
    domain: 'springfieldcitywire.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Springfield Standard',
    domain: 'springfieldstandard.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Spring Times',
    domain: 'springstimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Sputnik',
    domain: 'sputniknews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Sputnik News Agency – France',
    domain: 'fr.sputniknews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Sputnik News Agency – Germany',
    domain: 'snanews.de',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Sputnik News Agency',
    domain: 'sputniknews.in',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Sputnik News Agency – Italia',
    domain: 'it.sputniknews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'St. Joe-Benton Harbor News',
    domain: 'stjoebentonharbor.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'St. Pete Standard',
    domain: 'stpetestandard.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Stanislaus News',
    domain: 'stanislausnews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Stares at the World',
    domain: 'staresattheworld.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Star News Network',
    domain: 'thestarnewsnetwork.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'State of the Nation',
    domain: 'stateofthenation.co',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Staten Island Reporter',
    domain: 'statenislandreporter.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'St. Charles Times',
    domain: 'stcharlestimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'St. Cloud Sun',
    domain: 'stcloudsun.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Steadfast and Loyal',
    domain: 'steadfastandloyal.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Steadfast Clash',
    domain: 'steadfastclash.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Steadfast Daily',
    domain: 'steadfastdaily.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Stopping Socialism',
    domain: 'stoppingsocialism.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'St. Paul Reporter',
    domain: 'stpaulreporter.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'South Birmingham Times',
    domain: 'southbirminghamtimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'South Fulton Today',
    domain: 'southfultontoday.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'South OC Times',
    domain: 'southoctimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'South Pima News',
    domain: 'southpimanews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'South SFV Today',
    domain: 'southsfvtoday.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Speech Point',
    domain: 'speech-point.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'St. Clair Today',
    domain: 'stclairtoday.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'St. Louis Record',
    domain: 'stlrecord.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Strafford News',
    domain: 'straffordnews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Strategic Culture Foundation',
    domain: 'strategic-culture.org',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Students for Trump',
    domain: 'trumpstudents.org',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Sturgis-Coldwater News',
    domain: 'sturgiscoldwaternews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Suffolk Reporter',
    domain: 'suffolkreporter.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Summerlin Reporter',
    domain: 'summerlinreporter.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Sumter Times',
    domain: 'sumtertimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Sunflower State News',
    domain: 'sunflowerstatenews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Sunshine Sentinel',
    domain: 'sunshinesentinel.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Support Israel Now',
    domain: 'supportisraelnow.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Sussex Review',
    domain: 'sussexreview.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'SwampDrain.com',
    domain: 'swampdrain.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Swarajya',
    domain: 'swarajyamag.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'SW Alaska News',
    domain: 'swalaskanews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'SW Arizona News',
    domain: 'swarizonanews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'SW Arkansas Times',
    domain: 'swarkansastimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'SW Bluegrass News',
    domain: 'swbluegrassnews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'SW Colorado News',
    domain: 'swcoloradonews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'SW Connecticut News',
    domain: 'swconnnews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'SW Georgia News',
    domain: 'swgeorgianews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'SW Indiana News',
    domain: 'swindiananews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'SW Iowa Times',
    domain: 'swiowatimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'SW Kansas News',
    domain: 'swkansasnews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'SW Louisiana News',
    domain: 'swlouisiananews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'SW Minnesota Today',
    domain: 'swminnesotatoday.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'SW Mississippi News',
    domain: 'swmissnews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'SW New Hampshire News',
    domain: 'swnewhampshirenews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'SW New Mexico News',
    domain: 'swnewmexiconews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'SW Riverside News',
    domain: 'swriversidenews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'SW Valley Times',
    domain: 'swvalleytimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'SW Vegas News',
    domain: 'swvegasnews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Syracuse Sun',
    domain: 'syracusesun.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Syriana Analysis',
    domain: 'syriana-analysis.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Tabasco Post',
    domain: 'tabascopost.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Taki’s Magazine',
    domain: 'takimag.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Tallahassee Sun',
    domain: 'tallahasseesun.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Tampa Republic',
    domain: 'tamparepublic.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Tasnim News Agency',
    domain: 'tasnimnews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'TB Daily News',
    domain: 'tbdailynews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Tea Party Inc.',
    domain: 'teaparty.org',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Tea Party Patriots',
    domain: 'teapartypatriots.org',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'TechStartups',
    domain: 'techstartups.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Teddy Stick',
    domain: 'teddystick.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Telesur',
    domain: 'telesurtv.net',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Teller Report',
    domain: 'tellerreport.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The American Mirror',
    domain: 'theamericanmirror.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Angry Patriot',
    domain: 'angrypatriotmovement.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Bearded Patriot',
    domain: 'thebeardedpatriot.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Beltway Report',
    domain: 'thebeltwayreport.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The BL',
    domain: 'thebl.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Blacksphere',
    domain: 'theblacksphere.net',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Blaze',
    domain: 'theblaze.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Blue State Conservative',
    domain: 'thebluestateconservative.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Colorado Herald',
    domain: 'thecoloradoherald.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Conservative Brief',
    domain: 'theconservativebrief.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Conservative Central',
    domain: 'theconservativecentral.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Conservative Papers',
    domain: 'conservativepapers.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Covid World',
    domain: 'thecovidworld.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Counter Signal',
    domain: 'thecountersignal.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Daily Bell',
    domain: 'thedailybell.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Daily Boulder',
    domain: 'dailyboulder.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The DC Clothesline',
    domain: 'dcclothesline.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The DC Patriot',
    domain: 'thedcpatriot.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Desert Review',
    domain: 'thedesertreview.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Duran',
    domain: 'theduran.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Economic Times',
    domain: 'economictimes.indiatimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Epoch Times',
    domain: 'theepochtimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Federalist',
    domain: 'thefederalist.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Federalist Papers Project',
    domain: 'thefederalistpapers.org',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Federation for American Immigration Reform',
    domain: 'fairus.org',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Florida Standard',
    domain: 'theflstandard.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Freedom Times',
    domain: 'thefreedomtimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Free Telegraph',
    domain: 'freetelegraph.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Frisky',
    domain: 'thefrisky.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Gateway Pundit',
    domain: 'thegatewaypundit.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Grayzone',
    domain: 'thegrayzone.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Hayride',
    domain: 'thehayride.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Horn',
    domain: 'thehornnews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Jewish Voice',
    domain: 'thejewishvoice.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Joe Rogan Experience',
    domain: 'joerogan.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Last Refuge',
    domain: 'theconservativetreehouse.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Last Resistance',
    domain: 'lastresistance.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Laugh Club',
    domain: 'thelaughclub.net',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Liberty Daily',
    domain: 'thelibertydaily.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Liberty Loft',
    domain: 'thelibertyloft.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Liberty Revolution',
    domain: 'thelibertyrevolution.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Limited Times',
    domain: 'newsrnd.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Majalla',
    domain: 'eng.majalla.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Manhattan',
    domain: 'themanhattan.press',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Michigan Independent',
    domain: 'michiganindependent.co',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Millennium Report',
    domain: 'themillenniumreport.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The National Patriot',
    domain: 'thenationalpatriot.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The National Pulse',
    domain: 'thenationalpulse.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The National (UAE)',
    domain: 'thenational.ae',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Ohio Independent',
    domain: 'ohioindependent.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Ohio Star',
    domain: 'theohiostar.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Other 98%',
    domain: 'other98.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Patriot Nation',
    domain: 'thepatriotnation.net',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Post & Email',
    domain: 'thepostemail.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Proud Liberal',
    domain: 'theproudliberal.org',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Published Reporter',
    domain: 'publishedreporter.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Raging Patriot',
    domain: 'theragingpatriot.org',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Rebel News',
    domain: 'rebelnews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Religion of Peace',
    domain: 'thereligionofpeace.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Remnant Newspaper',
    domain: 'remnantnewspaper.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The RFAngle',
    domain: 'rfangle.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Region News',
    domain: 'theregionnews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Right Scoop',
    domain: 'therightscoop.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Right Stuff',
    domain: 'therightstuff.biz',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Ron Paul Institute',
    domain: 'ronpaulinstitute.org',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Science Times',
    domain: 'sciencetimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Scoop',
    domain: 'thescoop.us',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Tennessee Star',
    domain: 'tennesseestar.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Tehran Times',
    domain: 'tehrantimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Times of America',
    domain: 'digifection.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The True Defender',
    domain: 'thetruedefender.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The True Reporter',
    domain: 'thetruereporter.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Truth Voice',
    domain: 'thetruthvoice.net',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Union Journal',
    domain: 'theunionjournal.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Unz Review',
    domain: 'unz.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Warren Sun',
    domain: 'warrensun.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Wisconsin Independent',
    domain: 'wisconsinindependent.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Three Rivers Gazette',
    domain: 'threeriversgazette.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Thumb Reporter',
    domain: 'thumbreporter.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Tobacco News Wire',
    domain: 'tobacconewswire.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'TooFab',
    domain: 'toofab.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Topeka Sun',
    domain: 'topekasun.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Townhall',
    domain: 'townhall.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'TPL News',
    domain: 'tplnews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Treasure Coast Sun',
    domain: 'treasurecoastsun.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Treasure Valley Times',
    domain: 'treasurevalleytimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Trending Politics',
    domain: 'trendingpolitics.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Triangle News',
    domain: 'trianglenews.org',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Tri-City Record',
    domain: 'tri-cityrecord.org',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Tri-City Sun',
    domain: 'tricitysun.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'True Activist',
    domain: 'truthexam.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'True Viral News',
    domain: 'trueviralnews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Trump.News',
    domain: 'trump.news',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Trump Train News',
    domain: 'trumptrainnews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Truth and Action',
    domain: 'truthandaction.org',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Truth Based Media',
    domain: 'truthbasedmedia.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Truth in Media',
    domain: 'truthinmedia.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Truth Press',
    domain: 'truthpress.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Tucson Standard',
    domain: 'tucsonstandard.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Tulare Times',
    domain: 'tularetimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Turning Point USA',
    domain: 'tpusa.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Tuscaloosa Leader',
    domain: 'tuscaloosaleader.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Two Rivers News',
    domain: 'tworiversnews.org',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Understanding the threat',
    domain: 'understandingthethreat.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Union County Review',
    domain: 'unioncountyreview.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Unite America First',
    domain: 'uniteamericafirst.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Unity News Network',
    domain: 'unitynewsnetwork.co.uk',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Unmuzzled News',
    domain: 'unmuzzlednews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'UP Gazette',
    domain: 'upgazette.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Upper Delta News',
    domain: 'upperdeltanews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Upper Peninsula Times',
    domain: 'upperpeninsulatimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Urdupoint',
    domain: 'urdupoint.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'US Backlash',
    domain: 'usbacklash.org',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'USA Really',
    domain: 'usareally.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'USA Supreme',
    domain: 'usasupreme.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'USAnetwork.info',
    domain: 'usanetwork.info',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'USSA News',
    domain: 'ussanews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Valeurs Actuelles',
    domain: 'valeursactuelles.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Valley Gazette',
    domain: 'valleygazette.org',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Vancouver Times',
    domain: 'vancouvertimes.org',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Vanguard America',
    domain: 'bloodandsoil.org',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Vdare',
    domain: 'vdare.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Verdugos News',
    domain: 'verdugosnews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Victor Valley Times',
    domain: 'victorvalleytimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Vidmax',
    domain: 'vidmax.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Vigilant News',
    domain: 'vigilantnews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Viral Cocaine',
    domain: 'viralcocaine.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Virginia Star',
    domain: 'thevirginiastar.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Vision Times',
    domain: 'visiontimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WallBuilders',
    domain: 'wallbuilders.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'War on Fakes',
    domain: 'waronfakes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Warner Robins Today',
    domain: 'warnerrobinstoday.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'War Room (Steve Bannon)',
    domain: 'warroom.org',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Washington Sources',
    domain: 'washingtonsources.org',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Washington Times',
    domain: 'washingtontimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Washoe Gazette',
    domain: 'washoegazette.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Washoe News',
    domain: 'washoenews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Waterford Today',
    domain: 'waterfordtoday.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Waterloo Times',
    domain: 'waterlootimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Wayne Herald',
    domain: 'wayneherald.org',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WC Georgia News',
    domain: 'wcgeorgianews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WC Indiana News',
    domain: 'wcindiananews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WC Iowa News',
    domain: 'wciowanews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WC Minnesota News',
    domain: 'wcminnesotanews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WC Mississippi News',
    domain: 'wcmissnews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WC Missouri News',
    domain: 'wcmissourinews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WC New Mexico News –',
    domain: 'wcnewmexiconews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Wealth Management Wire',
    domain: 'wealthmanagementwire.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Weibo',
    domain: 'weibo.co',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'We Love Trump',
    domain: 'welovetrump.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'West Atlanta News',
    domain: 'westatlantanews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'We The People Daily',
    domain: 'wethepeopledaily.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Westbank Louisiana News',
    domain: 'westbanklanews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'West Central Alabama News',
    domain: 'wcalabamanews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'West Central Michigan News',
    domain: 'wcmichigannews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'West Central Reporter',
    domain: 'westcentralreporter.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Westchester Reporter',
    domain: 'westchesterreporter.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'West Contra Costa News',
    domain: 'westcontracostanews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'West Cook News',
    domain: 'westcooknews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'West DSM News',
    domain: 'westdsmnews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'West El Dorado News',
    domain: 'westeldoradonews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'West Essex News',
    domain: 'westessexnews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'West Hudson Valley News',
    domain: 'westhudvalleynews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Western Wayne Today',
    domain: 'westernwaynetoday.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'West Florida News',
    domain: 'westflnews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'West Hillsborough News',
    domain: 'westhillsboroughnews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'West Indy News',
    domain: 'westindynews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'West LA Times',
    domain: 'westlatimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'West Massachusetts News',
    domain: 'westmassnews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'West NY News',
    domain: 'westnynews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'West OC Times',
    domain: 'westoctimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'West Pennyroyal News',
    domain: 'westpennyroyalnews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'West SBV Times',
    domain: 'westsbvtimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'West SFV Today',
    domain: 'westsfvtoday.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'West SGV News',
    domain: 'westsgvnews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'West STL News',
    domain: 'stlwestnews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'West Twin Cities',
    domain: 'westtwincities.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'West Ventura News',
    domain: 'westventuranews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'West Volusia News',
    domain: 'westvolusianews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Whatfinger',
    domain: 'whatfinger.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'What’s the Harm',
    domain: 'whatstheharm.net',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Wichita Standard',
    domain: 'wichitastandard.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Will County Gazette',
    domain: 'willcountygazette.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Wine Country Times',
    domain: 'winecountrytimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Wiregrass Times',
    domain: 'wiregrasstimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Wisconsin Daily Star',
    domain: 'wisconsindailystar.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Wisconsin Lake Times',
    domain: 'wisconsinlaketimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WiseVoter',
    domain: 'wisevoter.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Witherspoon Institute',
    domain: 'thepublicdiscourse.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WLT Report',
    domain: 'wltreport.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WND News Center',
    domain: 'wndnewscenter.org',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Women are Human',
    domain: 'womenarehuman.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'World Net Daily',
    domain: 'wnd.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'World News',
    domain: 'wn.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WorldNewsERA',
    domain: 'worldnewsera.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'World of Buzz',
    domain: 'worldofbuzz.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WorldStarHipHop',
    domain: 'worldstarhiphop.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WorldTimeTodays',
    domain: 'worldtimetodays.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'World Tribune',
    domain: 'worldtribune.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Wyandotte Times',
    domain: 'wyandottetimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Xinhua English',
    domain: 'news.cn',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Xinhua News Agency',
    domain: 'xinhuanet.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Yavapai News',
    domain: 'yavapainews.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Yellowhammer Times',
    domain: 'yellowhammertimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Yellowstone Times',
    domain: 'yellowstonetimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Young Americans for Liberty',
    domain: 'yaliberty.org',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'YourContent',
    domain: 'yc.news',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Yuba-Sutter Times',
    domain: 'yubasuttertimes.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Yucatan Post',
    domain: 'theyucatanpost.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Yuma Standard',
    domain: 'yumastandard.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Z3 News',
    domain: 'z3news.com',
    bias_labels: [
      {
        label: 'questionable',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: '21st Century Wire',
    domain: '21stcenturywire.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: '369 News',
    domain: '369news.net',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: '911Truth.org',
    domain: '911truth.org',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Above Top Secret',
    domain: 'abovetopsecret.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'A Call for an Uprising',
    domain: 'acallforanuprising.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'ACNLatitudes',
    domain: 'latitudes.org',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Activist Post',
    domain: 'activistpost.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'ADDitude Magazine',
    domain: 'additudemag.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Age of Autism',
    domain: 'ageofautism.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Alien News',
    domain: 'newsinstact.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Alliance for Advanced Health',
    domain: 'allianceforadvancedhealth.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Alliance for Natural Health International',
    domain: 'anhinternational.org',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Altermed Zentrum',
    domain: 'altermedzentrum.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Alternative Daily',
    domain: 'thealternativedaily.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Alternative Media Television (AMTV)',
    domain: 'amtvmedia.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'AlternativeNews.com',
    domain: 'alternativenews.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'AltHealth Works',
    domain: 'althealthworks.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'American Digital News',
    domain: 'americandigitalnews.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'American Free Press',
    domain: 'americanfreepress.net',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'American Intelligence Media',
    domain: 'aim4truth.org',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'American Media Group',
    domain: 'amg-news.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'American Policy Center',
    domain: 'americanpolicy.org',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'America’s Frontline Doctors',
    domain: 'americasfrontlinedoctors.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Ancient Code',
    domain: 'ancient-code.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Ancient Origins',
    domain: 'ancient-origins.net',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'AND Magazine',
    domain: 'andmagazine.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Answers in Genesis',
    domain: 'answersingenesis.org',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Anti-Empire',
    domain: 'anti-empire.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Anya Vien',
    domain: 'anyavien.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Architects & Engineers for 9/11 Truth',
    domain: 'ae911truth.org',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Asia-Pacific Research',
    domain: 'asia-pacificresearch.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Assassination Science',
    domain: 'assassinationscience.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Australian National Review',
    domain: 'australiannationalreview.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Autism Speaks',
    domain: 'autismspeaks.org',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Awake Canada',
    domain: 'awakecanada.org',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Awareness Act',
    domain: 'awarenessact.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Behold Israel',
    domain: 'beholdisrael.org',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Best News Here',
    domain: 'bestnewshere.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Big Government News',
    domain: 'biggovernment.news',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'BioDefense',
    domain: 'biodefense.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Biologos Foundation',
    domain: 'biologos.org',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Bioscience Resource Project',
    domain: 'bioscienceresource.org',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Biotech Express Magazine',
    domain: 'biotechexpressmag.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Blacklisted News',
    domain: 'blacklistednews.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'BonSens',
    domain: 'bonsens.info',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Brand New Tube',
    domain: 'brandnewtube.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Brighteon',
    domain: 'brighteon.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'BrightSide',
    domain: 'brightside.me',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Canberra Declaration',
    domain: 'canberradeclaration.org.au',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Catholic Online',
    domain: 'catholic.org',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Charisma News',
    domain: 'charismanews.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Children’s Health Defense',
    domain: 'childrenshealthdefense.org',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Christian Apologetics & Research Ministry (CARM)',
    domain: 'carm.org',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Christian Broadcasting Network (CBN)',
    domain: 'www1.cbn.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Christian Ministries International',
    domain: 'creation.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Christian Science',
    domain: 'christianscience.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Christian Truth Center',
    domain: 'christiantruthcenter.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Citizens for Legitimate Government',
    domain: 'legitgov.org',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Climate Change Dispatch',
    domain: 'climatechangedispatch.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Climate Depot',
    domain: 'climatedepot.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Climate Etc',
    domain: 'judithcurry.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'CNN So Fake News',
    domain: 'cnnsofake.news',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Coast to Coast AM',
    domain: 'coasttocoastam.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Collective Evolution',
    domain: 'collective-evolution.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Committee for a Constructive Tomorrow (CFACT)',
    domain: 'cfact.org',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Conscious Life News',
    domain: 'consciouslifenews.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Conspiracy Daily Update',
    domain: 'conspiracydailyupdate.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Consumer Wellness Center',
    domain: 'consumerwellness.org',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Corey’s Digs',
    domain: 'coreysdigs.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Corruptico',
    domain: 'corruptico.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Cosmic Intelligence Agency',
    domain: 'cosmicintelligenceagency.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Covert Geopolitics',
    domain: 'geopolitics.co',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Covid Call to Humanity',
    domain: 'covidcalltohumanity.org',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'CreationWiki',
    domain: 'creationwiki.org',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'CS Globe',
    domain: 'csglobe.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'CultureWatch',
    domain: 'billmuehlenberg.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Cureus Journal of Medical Science',
    domain: 'cureus.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Curious Mind Magazine',
    domain: 'curiousmindmagazine.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'DailyClout',
    domain: 'dailyclout.io',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Daily Grail',
    domain: 'dailygrail.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'DailyHealthPost',
    domain: 'dailyhealthpost.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Daily Sceptic',
    domain: 'dailysceptic.org',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Dark Journalist',
    domain: 'darkjournalist.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'David Icke',
    domain: 'davidicke.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'David Wolfe',
    domain: 'davidwolfe.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Discovery Institute',
    domain: 'discovery.org',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Disobedient Media',
    domain: 'disobedientmedia.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Dissident Voice',
    domain: 'dissidentvoice.org',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'DoctorOz.com (Dr. Oz)',
    domain: 'doctoroz.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Doctors for Covid Ethics',
    domain: 'doctors4covidethics.org',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Dollar Vigilante',
    domain: 'dollarvigilante.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Dr. Axe',
    domain: 'draxe.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Dr. Morse TV',
    domain: 'drmorse.tv',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Earthpulse Press',
    domain: 'earthpulse.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Educate Inspire Change',
    domain: 'educateinspirechange.org',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Educate Yourself',
    domain: 'educate-yourself.org',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Electroverse',
    domain: 'electroverse.net',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Eluxe Magazine',
    domain: 'eluxemagazine.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Environmental Working Group (EWG)',
    domain: 'ewg.org',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Escape all these Things',
    domain: 'escapeallthesethings.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Europe Reloaded',
    domain: 'europereloaded.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Evolution News and Views',
    domain: 'evolutionnews.org',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Fabiosa',
    domain: 'fabiosa.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'FaithIt',
    domain: 'faithit.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'FaithPanda',
    domain: 'faithpanda.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Food Babe',
    domain: 'foodbabe.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Food Matters',
    domain: 'foodmatters.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Forever Conscious',
    domain: 'foreverconscious.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Free Thought Project',
    domain: 'thefreethoughtproject.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Freedom Advocates',
    domain: 'freedomadvocates.org',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Freedomain Radio',
    domain: 'freedomainradio.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Friends of Science',
    domain: 'friendsofscience.org',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Front Line COVID-19 Critical Care Alliance (FLCCC)',
    domain: 'covid19criticalcare.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Fully Human –',
    domain: 'fully-human.org',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Gaia',
    domain: 'gaia.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'GeoEngineering Watch',
    domain: 'geoengineeringwatch.org',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Get Holistic Health',
    domain: 'getholistichealth.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Global Healing Center',
    domain: 'globalhealingcenter.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Global Research',
    domain: 'globalresearch.ca',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'GMO Watch',
    domain: 'gmowatch.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'GMWatch',
    domain: 'gmwatch.org',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Godlike Productions',
    domain: 'godlikeproductions.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Got Questions',
    domain: 'gotquestions.org',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Government Slaves',
    domain: 'govtslaves.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'GreenMedInfo',
    domain: 'greenmedinfo.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Greenpeace',
    domain: 'greenpeace.org',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Health and Money News',
    domain: 'healthandmoneynews.wordpress.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Healing Food Reference',
    domain: 'healingfoodreference.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Healing Oracle',
    domain: 'healingoracle.ch',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Health Impact News',
    domain: 'healthimpactnews.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Health Nut News',
    domain: 'healthnutnews.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Health Ranger Report',
    domain: 'healthrangerreport.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Health Sciences Institute',
    domain: 'hsionline.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Healthy and Natural World',
    domain: 'healthyandnaturalworld.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Healthy Food House',
    domain: 'healthyfoodhouse.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Healthy Holistic Living',
    domain: 'healthy-holistic-living.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Henry Makow (savethemales.ca)',
    domain: 'savethemales.ca',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Herb',
    domain: 'herb.co',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Higher Perspective',
    domain: 'higherperspectives.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Homeopathy Journal',
    domain: 'homeopathyjournal.net',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Home Vaccine Education Network',
    domain: 'homevaccineeducationnetwork.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Humans are Free',
    domain: 'humansarefree.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'ICAN – Informed Consent Action Network',
    domain: 'icandecide.org',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'iHealthtube.com',
    domain: 'ihealthtube.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'I Heart Intelligence',
    domain: 'iheartintelligence.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Illuminati Watcher',
    domain: 'illuminatiwatcher.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Independent Science News',
    domain: 'independentsciencenews.org',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Infinite Unknown',
    domain: 'infiniteunknown.net',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Information Clearing House',
    domain: 'informationclearinghouse.info',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Infowars',
    domain: 'infowars.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Institute for Creation Research',
    domain: 'icr.org',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Institute for Responsible Technology',
    domain: 'responsibletechnology.org',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Investment Watch Blog',
    domain: 'investmentwatchblog.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Iowa Climate Science Education',
    domain: 'iowaclimate.org',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Irish Sentinel',
    domain: 'irishsentinel.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Israel365 News',
    domain: 'israel365news.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Jeda News',
    domain: 'jedanews.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Jehovah’s Witnesses',
    domain: 'jw.org',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Jesus is Savior',
    domain: 'jesus-is-savior.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'JunkScience.com',
    domain: 'junkscience.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'LaRouche PAC',
    domain: 'larouchepac.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Learn The Risk',
    domain: 'learntherisk.org',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'LeftCult',
    domain: 'leftcult.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Les Moutons Rebelles',
    domain: 'lesmoutonsrebelles.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Liberty Planet',
    domain: 'libertyplanets.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'LifeSpa',
    domain: 'lifespa.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'LittleThings',
    domain: 'littlethings.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Live Action',
    domain: 'liveaction.org',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Livestrong.com',
    domain: 'livestrong.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Living Whole',
    domain: 'livingwhole.org',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Lockdown Resistance',
    domain: 'endlockdowns.org',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Malone Institute',
    domain: 'maloneinstitute.org',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Media Fact Watch',
    domain: 'mediafactwatch.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Media Roots',
    domain: 'mediaroots.org',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Medical Censorship News',
    domain: 'medicalcensorship.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Medical Daily',
    domain: 'medicaldaily.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Medical Kidnap',
    domain: 'medicalkidnap.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Medical Medium',
    domain: 'medicalmedium.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'MedicalTyranny',
    domain: 'medicaltyranny.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Medicine News',
    domain: 'medicine.news',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Mercola',
    domain: 'mercola.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'MindBodyGreen',
    domain: 'mindbodygreen.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Modern Alternative Mama',
    domain: 'modernalternativemama.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'National File',
    domain: 'nationalfile.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'National Vaccine Information Institute',
    domain: 'nvic.org',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Natural Cures',
    domain: 'naturalcures.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Natural Health 365',
    domain: 'naturalhealth365.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Natural News',
    domain: 'naturalnews.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Natural News Radio',
    domain: 'naturalnewsradio.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Natural Society',
    domain: 'naturalsociety.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Naturally Savvy',
    domain: 'naturallysavvy.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Need to Know',
    domain: 'needtoknow.news',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Neon Nettle',
    domain: 'neonnettle.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'News Inside Out',
    domain: 'newsinsideout.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'News Target',
    domain: 'newstarget.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'NoTricksZone',
    domain: 'notrickszone.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Now The End Begins',
    domain: 'nowtheendbegins.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Nutritionfacts.org',
    domain: 'nutritionfacts.org',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'NWO Report',
    domain: 'nworeport.me',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Odysee',
    domain: 'odysee.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Online Updates',
    domain: 'online-updates.net',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Organic Consumers Association',
    domain: 'organicconsumers.org',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Organic Facts',
    domain: 'organicfacts.net',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Our Health Guides',
    domain: 'ourhealthguides.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Pandemic News',
    domain: 'pandemic.news',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Patriots for Truth',
    domain: 'patriots4truth.org',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'PETA',
    domain: 'peta.org',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Philosophers Stone',
    domain: 'philosophers-stone.info',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Physicians for Informed Consent',
    domain: 'physiciansforinformedconsent.org',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Prepare for Change',
    domain: 'prepareforchange.net',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Press for Truth',
    domain: 'pressfortruth.ca',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Prevention Magazine',
    domain: 'prevention.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Principia Scientific International',
    domain: 'principia-scientific.org',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Primary Doctor Medical Journal',
    domain: 'pdmj.org',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Prison Planet',
    domain: 'prisonplanet.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Prophecy News Watch',
    domain: 'prophecynewswatch.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Prophecy Today',
    domain: 'prophecytoday.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Real Climate Science',
    domain: 'realclimatescience.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Real Jew News',
    domain: 'realjewnews.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Real News 24',
    domain: 'realnews24.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Redoubt News',
    domain: 'redoubtnews.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'RedPill Project',
    domain: 'redpillpodcasts.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Renegade Tribune',
    domain: 'renegadetribune.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Rense',
    domain: 'rense.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Return to Now',
    domain: 'returntonow.net',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Rumor Mill News',
    domain: 'rumormillnews.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'SaneVax',
    domain: 'sanevax.org',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Sante Plus Magazine',
    domain: 'santeplusmag.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Science Vibe',
    domain: 'sciencevibe.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'SGT Report',
    domain: 'sgtreport.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Sheep Killers',
    domain: 'sheepkillers.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Shoebat',
    domain: 'shoebat.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Signs of the Times (SOTT)',
    domain: 'sott.net',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Skeptiko',
    domain: 'skeptiko.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Space.News',
    domain: 'space.news',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Stillness in the Storm',
    domain: 'sitsshow.blogspot.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Stormfront',
    domain: 'stormfront.org',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Sustainable Pulse',
    domain: 'sustainablepulse.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Swiss Policy Research',
    domain: 'swprs.org',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Annunaki',
    domain: 'annunaki.org',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Automatic Earth',
    domain: 'theautomaticearth.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Common Sense Show',
    domain: 'thecommonsenseshow.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Corbett Report',
    domain: 'corbettreport.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Daily Expose',
    domain: 'dailyexpose.co.uk',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Daily Sheeple',
    domain: 'thedailysheeple.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The European Union Times',
    domain: 'eutimes.net',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Event Chronicle',
    domain: 'theeventchronicle.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Fullerton Informer',
    domain: 'thefullertoninformer.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Greanville Post',
    domain: 'greanvillepost.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Health Ranger',
    domain: 'healthranger.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Healthy American',
    domain: 'thehealthyamerican.org',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Hearty Soul',
    domain: 'theheartysoul.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Highwire',
    domain: 'thehighwire.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Liberty Beacon',
    domain: 'thelibertybeacon.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Mind Unleashed',
    domain: 'themindunleashed.org',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The New Nationalist',
    domain: 'newnationalist.net',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Pulse',
    domain: 'thepulse.one',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Purist Magazine',
    domain: 'thepuristonline.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Rundown Live',
    domain: 'therundownlive.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Stream',
    domain: 'stream.org',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Trumpet',
    domain: 'thetrumpet.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Truth about Cancer',
    domain: 'thetruthaboutcancer.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Truth Seeker',
    domain: 'thetruthseeker.co.uk',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Vaccine Reaction',
    domain: 'thevaccinereaction.org',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Vermont Independent',
    domain: 'vermontindependent.org',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'The Waking Times',
    domain: 'wakingtimes.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Thinking Humanity',
    domain: 'thinkinghumanity.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Thought Catalog',
    domain: 'thoughtcatalog.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Thought Crime Radio',
    domain: 'thoughtcrimeradio.net',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Thrive Global',
    domain: 'thriveglobal.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Thrive Movement',
    domain: 'thrivemovement.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'TrialSite News',
    domain: 'trialsitenews.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'TruNews',
    domain: 'trunews.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Twisted News',
    domain: 'twisted.news',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Unlimited Hangout',
    domain: 'unlimitedhangout.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'UK Column',
    domain: 'ukcolumn.org',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'USA Hitman',
    domain: 'usahitman.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'USAWatchdog.com',
    domain: 'usawatchdog.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Vaccine Impact',
    domain: 'vaccineimpact.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Vaccine News',
    domain: 'vaccines.news',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Vaccine Papers',
    domain: 'vaccinepapers.org',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Vaccines Revealed',
    domain: 'vaccinesrevealed.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Vaccine Safety Info',
    domain: 'vaccinesafety.info',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Vaccine Safety Research Foundation (VSRF)',
    domain: 'vacsafety.org',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'VacTruth.com',
    domain: 'vactruth.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Vaxxter',
    domain: 'vaxxter.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Veterans Today',
    domain: 'veteranstoday.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Vigilant Citizen',
    domain: 'vigilantcitizen.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Watts Up with that',
    domain: 'wattsupwiththat.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'We are Anonymous',
    domain: 'anonhq.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'We are Change',
    domain: 'wearechange.org',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Weston A. Price Foundation',
    domain: 'westonaprice.org',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'What Really Happened',
    domain: 'whatreallyhappened.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'WhatDoesItMean',
    domain: 'whatdoesitmean.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Wide Awake Media',
    domain: 'wide-awake-media.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Wikispooks',
    domain: 'wikispooks.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Winter Watch',
    domain: 'winterwatch.net',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'World Affairs Blog',
    domain: 'worldaffairs.blog',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'World Council for Health',
    domain: 'worldcouncilforhealth.org',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'World Doctors Alliance',
    domain: 'worlddoctorsalliance.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'World Lifestyle',
    domain: 'worldlifestyle.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'World Truth TV',
    domain: 'worldtruth.tv',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Worldview Weekend',
    domain: 'worldviewweekend.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'X22 Report',
    domain: 'x22report.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
  {
    title: 'Zerohedge',
    domain: 'zerohedge.com',
    bias_labels: [
      {
        label: 'conspiracy/pseudoscience',
        labeler: 'mediabiasfactcheck.com',
      },
    ],
  },
];
