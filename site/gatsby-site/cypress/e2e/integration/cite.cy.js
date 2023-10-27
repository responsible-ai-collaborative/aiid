import { maybeIt } from '../../support/utils';
import flaggedReport from '../../fixtures/reports/flagged.json';
import unflaggedReport from '../../fixtures/reports/unflagged.json';
import { format, getUnixTime } from 'date-fns';
import updateOneIncidentFlagged from '../../fixtures/incidents/updateOneIncidentFlagged.json';
import incident10 from '../../fixtures/incidents/fullIncident10.json';
import { transformIncidentData, deleteIncidentTypenames } from '../../../src/utils/cite';
import { transformReportData, deleteReportTypenames } from '../../../src/utils/reports';
const { gql } = require('@apollo/client');

describe('Cite pages', () => {
  const discoverUrl = '/apps/discover';

  const incidentId = 10;

  const url = `/cite/${incidentId}`;

  let user;

  before('before', function () {
    // Skip all tests if the environment is empty since /cite/{incident_id} is not available
    Cypress.env('isEmptyEnvironment') && this.skip();

    cy.query({
      query: gql`
        {
          user(query: { first_name: "Test", last_name: "User" }) {
            userId
            first_name
            last_name
          }
        }
      `,
    }).then(({ data: { user: userData } }) => {
      user = userData;
    });
  });

  maybeIt('Should show an edit link to users with the appropriate role', {}, () => {
    cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));

    const id = 'r3';

    cy.visit('/cite/1#' + id);

    cy.get(`#${id} [data-cy="edit-report"]`).click();

    cy.waitForStableDOM();

    cy.url().should('contain', '/cite/edit/?report_number=3');
  });

  it('Successfully loads', () => {
    cy.visit(url);
  });

  // skipping until https://github.com/responsible-ai-collaborative/aiid/pull/1680/files is merged
  it.skip(
    'Should scroll to report when coming from the discover app',
    { retries: { runMode: 4 } },
    () => {
      cy.visit(discoverUrl);

      cy.disableSmoothScroll();

      cy.waitForStableDOM();

      cy.get('[data-cy="collapse-button"]:visible').click();

      cy.contains('Show Details on Incident #10').first().click();
      cy.waitForStableDOM();
      cy.url().should('include', '/cite/10/#r23');
      cy.waitForStableDOM();

      cy.contains('h5', '​Is Starbucks shortchanging its baristas?', { timeout: 8000 })
        .parents('[data-cy="incident-report-card"]')
        .then((subject) => {
          expect(subject[0].getBoundingClientRect().top).to.be.closeTo(0, 30);
        });
    }
  );

  it.skip('Should scroll to report when clicking on a report in the timeline', () => {
    cy.visit(url);

    cy.disableSmoothScroll();

    cy.waitForStableDOM();

    cy.get('text').contains('For some Starbucks workers, job leaves bitter taste').parents('a');

    cy.get('h5')
      .contains('For some Starbucks workers, job leaves bitter taste')
      .parents('[data-cy="incident-report-card"]')
      .then((subject) => {
        expect(subject[0].getBoundingClientRect().top).to.be.closeTo(0, 1);
      });
  });

  // skipping until https://github.com/responsible-ai-collaborative/aiid/pull/1680/files is merged
  it.skip(
    'Should scroll to report when coming from the landing page',
    { retries: { runMode: 4 } },
    () => {
      cy.visit('/');

      cy.disableSmoothScroll();

      cy.waitForStableDOM();

      cy.get('[data-cy="latest-incident-report-title"]').then(($value) => {
        const incidentTitle = $value.text();

        cy.contains('Latest Incident Report').first().click();
        cy.waitForStableDOM();

        cy.contains('h5', incidentTitle, { timeout: 8000 })
          .parents('[data-cy="incident-report-card"]')
          .then((subject) => {
            expect(subject[0].getBoundingClientRect().top).to.be.closeTo(0, 30);
          });
      });
    }
  );

  it('Should show the incident stats table', () => {
    cy.visit(url);
    cy.get('[data-cy=incident-stats]').should('exist');
  });

  it('Should show editors in the stats table', () => {
    cy.visit(url);
    cy.get('[data-cy=incident-stats] > * > *')
      .contains('Editors')
      .parents('*')
      .contains('Sean McGregor');
  });

  it('Should flag an incident', () => {
    // mock requests until a testing database is implemented
    const _id = '23';

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindReport',
      'fetchReport',
      unflaggedReport
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'logReportHistory',
      'logReportHistory',
      {
        data: {
          logReportHistory: {
            report_number: 10,
          },
        },
      }
    );

    cy.visit(url + '#' + _id);

    cy.waitForStableDOM();

    cy.get(`[id="r${_id}"`).find('[data-cy="expand-report-button"]').click();

    cy.get(`[id="r${_id}"`).find('[data-cy="flag-button"]').click();

    cy.get('[data-cy="flag-report-23"]').as('modal').should('be.visible');

    cy.wait('@fetchReport');

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'UpdateReport',
      'updateReport',
      flaggedReport
    );

    const now = new Date();

    cy.clock(now);

    cy.get('@modal').find('[data-cy="flag-toggle"]').click();

    cy.wait('@updateReport')
      .its('request.body.variables')
      .then((variables) => {
        expect(variables.query.report_number).to.equal(23);
        expect(variables.set).deep.eq({
          flag: true,
          date_modified: format(now, 'yyyy-MM-dd'),
          epoch_date_modified: getUnixTime(now),
        });
      });

    cy.wait('@logReportHistory')
      .its('request.body.variables.input')
      .then((input) => {
        const expectedReport = deleteReportTypenames(
          transformReportData(flaggedReport.data.updateOneReport)
        );

        expectedReport.modifiedBy = '';
        expectedReport.date_modified = format(now, 'yyyy-MM-dd');
        expectedReport.epoch_date_modified = getUnixTime(now);

        expect(input).to.deep.eq(expectedReport);
      });

    cy.get('@modal').find('[data-cy="flag-toggle"]').should('be.disabled');

    cy.get('[aria-label="Close"]').click();

    cy.get('@modal').should('not.exist');
  });

  maybeIt('Should remove duplicate', () => {
    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'UpsertClassification',
      'upsertClassification',
      {
        data: {
          upsertOneClassification: {
            __typename: 'Classification',
            _id: '64ac2b05c70973a5bd3fa61a',
            attributes: [
              {
                __typename: 'ClassificationAttribute',
                short_name: 'Physical Objects',
                value_json: '"no"',
              },
              {
                __typename: 'ClassificationAttribute',
                short_name: 'Entertainment Industry',
                value_json: '"no"',
              },
              {
                __typename: 'ClassificationAttribute',
                short_name: 'Report, Test, or Study of data',
                value_json: '"no"',
              },
              {
                __typename: 'ClassificationAttribute',
                short_name: 'Deployed',
                value_json: '"yes"',
              },
              {
                __typename: 'ClassificationAttribute',
                short_name: 'Producer Test in Controlled Conditions',
                value_json: '"no"',
              },
              {
                __typename: 'ClassificationAttribute',
                short_name: 'Producer Test in Operational Conditions',
                value_json: '"no"',
              },
              {
                __typename: 'ClassificationAttribute',
                short_name: 'User Test in Controlled Conditions',
                value_json: '"no"',
              },
              {
                __typename: 'ClassificationAttribute',
                short_name: 'User Test in Operational Conditions',
                value_json: '"no"',
              },
              {
                __typename: 'ClassificationAttribute',
                short_name: 'Harm Domain',
                value_json: '"yes"',
              },
              {
                __typename: 'ClassificationAttribute',
                short_name: 'Tangible Harm',
                value_json: '"tangible harm definitively occurred"',
              },
              {
                __typename: 'ClassificationAttribute',
                short_name: 'AI System',
                value_json: '"yes"',
              },
              {
                __typename: 'ClassificationAttribute',
                short_name: 'Clear link to technology',
                value_json: '"yes"',
              },
              {
                __typename: 'ClassificationAttribute',
                short_name:
                  'There is a potentially identifiable specific entity that experienced the harm',
                value_json: 'true',
              },
              {
                __typename: 'ClassificationAttribute',
                short_name: 'AI Harm Level',
                value_json: '"AI tangible harm event"',
              },
              {
                __typename: 'ClassificationAttribute',
                short_name: 'Impact on Critical Services',
                value_json: '"no"',
              },
              {
                __typename: 'ClassificationAttribute',
                short_name: 'Rights Violation',
                value_json: '"no"',
              },
              {
                __typename: 'ClassificationAttribute',
                short_name: 'Involving Minor',
                value_json: '"no"',
              },
              {
                __typename: 'ClassificationAttribute',
                short_name: 'Detrimental Content',
                value_json: '"no"',
              },
              {
                __typename: 'ClassificationAttribute',
                short_name: 'Protected Characteristic',
                value_json: '"no"',
              },
              {
                __typename: 'ClassificationAttribute',
                short_name: 'Harm Distribution Basis',
                value_json: '["none"]',
              },
              {
                __typename: 'ClassificationAttribute',
                short_name: 'Clear link to Technology',
                value_json: '"yes"',
              },
              {
                __typename: 'ClassificationAttribute',
                short_name: 'Harmed Class of Entities',
                value_json: 'true',
              },
              {
                __typename: 'ClassificationAttribute',
                short_name: 'Annotator’s AI special interest intangible harm assessment',
                value_json: '"no"',
              },
              {
                __typename: 'ClassificationAttribute',
                short_name: 'Sector of Deployment',
                value_json: '["accommodation and food service activities"]',
              },
              {
                __typename: 'ClassificationAttribute',
                short_name: 'Public Sector Deployment',
                value_json: '"no"',
              },
              {
                __typename: 'ClassificationAttribute',
                short_name: 'Autonomy Level',
                value_json: '"Autonomy2"',
              },
              {
                __typename: 'ClassificationAttribute',
                short_name: 'Intentional Harm',
                value_json: '"No. Not intentionally designed to perform harm"',
              },
              {
                __typename: 'ClassificationAttribute',
                short_name: 'AI tools and methods',
                value_json: '""',
              },
              {
                __typename: 'ClassificationAttribute',
                short_name: 'Peer Reviewer',
                value_json: '""',
              },
              {
                __typename: 'ClassificationAttribute',
                short_name: 'Quality Control',
                value_json: 'false',
              },
              {
                __typename: 'ClassificationAttribute',
                short_name: 'Annotation Status',
                value_json: '"6. Complete and final"',
              },
              {
                __typename: 'ClassificationAttribute',
                short_name: 'Incident Number',
                value_json: '10',
              },
              {
                __typename: 'ClassificationAttribute',
                short_name: 'Annotator',
                value_json: '"002"',
              },
              {
                __typename: 'ClassificationAttribute',
                short_name: 'AI Tangible Harm Level Notes',
                value_json: '""',
              },
              {
                __typename: 'ClassificationAttribute',
                short_name: 'Notes (special interest intangible harm)',
                value_json: '""',
              },
              {
                __typename: 'ClassificationAttribute',
                short_name: 'Special Interest Intangible Harm',
                value_json: '"no"',
              },
              {
                __typename: 'ClassificationAttribute',
                short_name: 'Notes (AI special interest intangible harm)',
                value_json: '""',
              },
              {
                __typename: 'ClassificationAttribute',
                short_name: 'Date of Incident Year',
                value_json: '"2014"',
              },
              {
                __typename: 'ClassificationAttribute',
                short_name: 'Date of Incident Month',
                value_json: '""',
              },
              {
                __typename: 'ClassificationAttribute',
                short_name: 'Date of Incident Day',
                value_json: '""',
              },
              {
                __typename: 'ClassificationAttribute',
                short_name: 'Estimated Date',
                value_json: 'true',
              },
              {
                __typename: 'ClassificationAttribute',
                short_name: 'Multiple AI Interaction',
                value_json: '"no"',
              },
              {
                __typename: 'ClassificationAttribute',
                short_name: 'Embedded',
                value_json: '"no"',
              },
              {
                __typename: 'ClassificationAttribute',
                short_name: 'Location City',
                value_json: '""',
              },
              {
                __typename: 'ClassificationAttribute',
                short_name: 'Location State/Province (two letters)',
                value_json: '""',
              },
              {
                __typename: 'ClassificationAttribute',
                short_name: 'Location Country (two letters)',
                value_json: '"US"',
              },
              {
                __typename: 'ClassificationAttribute',
                short_name: 'Location Region',
                value_json: '"North America"',
              },
              {
                __typename: 'ClassificationAttribute',
                short_name: 'Infrastructure Sectors',
                value_json: '[]',
              },
              {
                __typename: 'ClassificationAttribute',
                short_name: 'Operating Conditions',
                value_json: '""',
              },
              {
                __typename: 'ClassificationAttribute',
                short_name: 'Notes (Environmental and Temporal Characteristics)',
                value_json: '""',
              },
              {
                __typename: 'ClassificationAttribute',
                short_name: 'Entities',
                value_json:
                  '[{"attributes":[{"short_name":"Entity","value_json":"\\"Starbucks\\""},{"short_name":"Named Entity","value_json":"true"},{"short_name":"Entity type","value_json":"\\"for-profit organization\\""},{"short_name":"Entity Relationship to the AI","value_json":"[\\"deployer\\"]"},{"short_name":"Harm Category Experienced","value_json":"\\"not applicable\\""},{"short_name":"Harm Type Experienced","value_json":"\\"not applicable\\""}]},{"attributes":[{"short_name":"Entity","value_json":"\\"Kronos\\""},{"short_name":"Named Entity","value_json":"true"},{"short_name":"Entity type","value_json":"\\"for-profit organization\\""},{"short_name":"Entity Relationship to the AI","value_json":"[\\"developer\\"]"},{"short_name":"Harm Category Experienced","value_json":"\\"not applicable\\""},{"short_name":"Harm Type Experienced","value_json":"\\"not applicable\\""}]},{"attributes":[{"short_name":"Entity","value_json":"\\"Kronos scheduling algorithm\\""},{"short_name":"Named Entity","value_json":"false"},{"short_name":"Entity type","value_json":"\\"product\\""},{"short_name":"Entity Relationship to the AI","value_json":"[\\"product containing AI\\"]"},{"short_name":"Harm Category Experienced","value_json":"\\"not applicable\\""},{"short_name":"Harm Type Experienced","value_json":"\\"not applicable\\""}]},{"attributes":[{"short_name":"Entity","value_json":"\\"Starbucks employees\\""},{"short_name":"Named Entity","value_json":"false"},{"short_name":"Entity type","value_json":"\\"group of individuals\\""},{"short_name":"Notes (Characterizing Entities and the Harm)","value_json":"\\"7.6 - It is reasonable to expect that unpredictable schedules have led to financial loss for other Starbucks employees through lost wages or unexpected expenses like childcare to attend work on short notice.\\""},{"short_name":"Harm Category Experienced","value_json":"\\"AI tangible harm issue\\""},{"short_name":"Harm Type Experienced","value_json":"\\"financial loss\\""},{"short_name":"Entity Relationship to the AI","value_json":"[\\"affected non-users\\"]"}]},{"attributes":[{"short_name":"Entity","value_json":"\\"Kylei Weisse\\""},{"short_name":"Named Entity","value_json":"true"},{"short_name":"Entity type","value_json":"\\"individual\\""},{"short_name":"Entity Relationship to the AI","value_json":"[\\"affected non-user\\"]"},{"short_name":"Harm Category Experienced","value_json":"\\"AI tangible harm event\\""},{"short_name":"Harm Type Experienced","value_json":"\\"financial loss\\""},{"short_name":"Notes (Characterizing Entities and the Harm)","value_json":"\\"Weisse incurred unexpected financial costs in order to make it to a shift that was assigned to him on very short notice. \\""}]},{"attributes":[{"short_name":"Entity","value_json":"\\"Starbucks employees\\""},{"short_name":"Named Entity","value_json":"false"},{"short_name":"Entity type","value_json":"\\"group of individuals\\""},{"short_name":"Entity Relationship to the AI","value_json":"[\\"affected non-users\\"]"},{"short_name":"Harm Category Experienced","value_json":"\\"Other harm not meeting CSET definitions\\""},{"short_name":"Harm Type Experienced","value_json":"\\"other intangible harm\\""},{"short_name":"Notes (Characterizing Entities and the Harm)","value_json":"\\"7.6 - Unpredictable schedules cause stress through financial and scheduling instability\\""}]},{"attributes":[{"short_name":"Entity","value_json":"\\"Jannette Navarro\\""},{"short_name":"Named Entity","value_json":"true"},{"short_name":"Entity type","value_json":"\\"individual\\""},{"short_name":"Entity Relationship to the AI","value_json":"[\\"affected non-user\\"]"},{"short_name":"Harm Category Experienced","value_json":"\\"Other harm not meeting CSET definitions\\""},{"short_name":"Harm Type Experienced","value_json":"\\"other intangible harm\\""},{"short_name":"Notes (Characterizing Entities and the Harm)","value_json":"\\"7.6 - Her unpredictable schedules caused serious stress and instability in her life.\\""}]}]',
              },
              {
                __typename: 'ClassificationAttribute',
                short_name: 'Lives Lost',
                value_json: '0',
              },
              {
                __typename: 'ClassificationAttribute',
                short_name: 'Injuries',
                value_json: '0',
              },
              {
                __typename: 'ClassificationAttribute',
                short_name: 'Estimated Harm Quantities',
                value_json: 'false',
              },
              {
                __typename: 'ClassificationAttribute',
                short_name: 'Notes ( Tangible Harm Quantities Information)',
                value_json: '""',
              },
              {
                __typename: 'ClassificationAttribute',
                short_name: 'AI System Description',
                value_json:
                  '"The Kronos scheduling algorithm is designed to optimize the productivity of stores like Starbucks by scheduling workers inconsistently throughout and across weeks based on predicted store traffic."',
              },
              {
                __typename: 'ClassificationAttribute',
                short_name: 'Data Inputs',
                value_json: '["schedules","worker profiles","store traffic"]',
              },
              {
                __typename: 'ClassificationAttribute',
                short_name: 'Notes (Information about AI System)',
                value_json: '""',
              },
              {
                __typename: 'ClassificationAttribute',
                short_name: 'Physical System Type',
                value_json: '""',
              },
              {
                __typename: 'ClassificationAttribute',
                short_name: 'AI Task',
                value_json: '["scheduling","productivity optimization","predict store traffic"]',
              },
              {
                __typename: 'ClassificationAttribute',
                short_name: 'Notes (AI Functionality and Techniques)',
                value_json: '""',
              },
            ],
            incidents: [
              {
                __typename: 'Incident',
                incident_id: 50,
              },
            ],
            namespace: 'CSETv1',
            notes: '',
            publish: true,
            reports: [],
          },
        },
      }
    );
    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'UpdateIncident',
      'updateIncident',
      {
        data: {
          updateOneIncident: {
            AllegedDeployerOfAISystem: [
              {
                __typename: 'Entity',
                entity_id: 'the-dao',
                name: 'The DAO',
              },
            ],
            AllegedDeveloperOfAISystem: [
              {
                __typename: 'Entity',
                entity_id: 'the-dao',
                name: 'The DAO',
              },
            ],
            AllegedHarmedOrNearlyHarmedParties: [
              {
                __typename: 'Entity',
                entity_id: 'dao-token-holders',
                name: 'DAO Token Holders',
              },
            ],
            __typename: 'Incident',
            date: '2016-06-17',
            description:
              'On June 18, 2016, an attacker successfully exploited a vulnerability in The Decentralized Autonomous Organization (The DAO) on the Ethereum blockchain to steal 3.7M Ether valued at $70M.',
            editor_dissimilar_incidents: [],
            editor_notes: null,
            editor_similar_incidents: [],
            editors: [
              {
                __typename: 'User',
                first_name: 'Sean',
                last_name: 'McGregor',
                userId: '619b47ea5eed5334edfa3bbc',
              },
            ],
            embedding: {
              __typename: 'IncidentEmbedding',
              from_reports: [
                905, 903, 902, 901, 900, 899, 898, 897, 896, 893, 892, 889, 888, 887, 886, 885, 884,
                883, 881, 880, 879, 878, 877, 876,
              ],
              vector: [
                -0.0661667212843895, 0.09495183080434799, 0.010774415917694569, -0.0843186303973198,
                0.07742074877023697, 0.002700377954170108, -0.0008173985406756401,
                0.057413578033447266, 0.09605775028467178, -0.1488141417503357,
                0.004636809695512056, 0.05968795344233513, 0.021845035254955292,
                -0.0762571468949318, 0.04533643648028374, -0.09069175273180008,
                -0.15813405811786652, -0.022130673751235008, -0.042528972029685974,
                -0.10905041545629501, -0.07701637595891953, 0.012940806336700916,
                0.018910806626081467, 0.11774744838476181, -0.04104795679450035,
                0.04697092995047569, 0.12957395613193512, 0.12819425761699677,
                -0.058150216937065125, 0.06893474608659744, -0.018372666090726852,
                -0.09186699986457825, 0.15362109243869781, 0.028102269396185875,
                0.025071216747164726, 0.09713421016931534, 0.01256798580288887,
                -0.01616877131164074, -0.041066594421863556, -0.017975831404328346,
                0.044571682810783386, 0.2357323318719864, -0.03317007049918175,
                -0.027484485879540443, 0.05428558960556984, -0.04763684794306755,
                -0.000010566697710601147, 0.04871894046664238, 0.0070588416419923306,
                0.004973179195076227, -0.026652388274669647, -0.008015204221010208,
                -0.07091150432825089, 0.033345308154821396, -0.09143518656492233,
                0.061592280864715576, 0.03615380451083183, 0.03313060477375984, 0.07367609441280365,
                -0.04913125932216644, -0.01810459792613983, -0.20834849774837494,
                -0.05211314558982849, -0.03780398145318031, 0.08887007087469101,
                -0.08282432705163956, -0.02316044457256794, 0.03807034716010094,
                0.003166689770296216, 0.048870425671339035, 0.053769540041685104,
                -0.029292000457644463, -0.002758365822955966, 0.035534992814064026,
                0.01716659404337406, -0.009857158176600933, -0.01820841059088707,
                0.1924063116312027, -0.10551274567842484, 0.015695957466959953, 0.08622416853904724,
                -0.09239751845598221, 0.3837597668170929, -0.00003496369390632026,
                -0.06069179251790047, -0.02606315352022648, 0.12018977850675583, 0.0050528384745121,
                0.03152324631810188, 0.0403270348906517, -0.025558656081557274, 0.04960830882191658,
                -0.05975503847002983, -0.03103153593838215, 0.05772930011153221, 0.0396592952311039,
                -0.0018726816633716226, 0.0107951695099473, -0.025373486801981926,
                -0.028895430266857147, 0.024420717731118202, -0.07865981012582779,
                0.10167545080184937, 0.08524877578020096, -0.05940742790699005,
                -0.006057963240891695, 0.06243671104311943, -0.056733157485723495,
                0.06139994040131569, -0.07574266940355301, 0.0216194037348032,
                -0.007321906741708517, 0.05265502631664276, -0.025458944961428642,
                0.02595309354364872, -0.015414812602102757, 0.02327638864517212,
                0.03251353278756142, 0.06957828998565674, 0.049125488847494125,
                -0.023909522220492363, 0.057829465717077255, 0.036426953971385956,
                -0.07245929539203644, 0.007933235727250576, -0.059332478791475296,
                -0.0435311533510685, -0.047337573021650314, -0.04053480550646782,
                0.03915426507592201, -0.06534258276224136, -0.2260957807302475,
                0.015165231190621853, 0.060068678110837936, -0.0034208225551992655,
                -0.026531696319580078, 0.04104552045464516, -0.07288438826799393,
                0.018118413165211678, -0.014951043762266636, -0.049901094287633896,
                0.0704021230340004, -0.017830973491072655, 0.051336515694856644,
                0.13087646663188934, 0.04126317426562309, -0.06066800281405449,
                -0.03640735521912575, 0.0299614816904068, -0.02631322294473648, 0.10236970335245132,
                -0.1225552037358284, -0.027694450691342354, -0.026750773191452026,
                -0.022465072572231293, 0.6963229775428772, 0.06071530655026436, 0.1349962204694748,
                0.0029604679439216852, -0.010627356357872486, 0.1805461049079895,
                0.009208586066961288, 0.06478998810052872, -0.04796625301241875,
                -0.05369967222213745, 0.03317221999168396, -0.07248315960168839,
                -0.04857209697365761, 0.021922463551163673, -0.014980182982981205,
                0.07153782248497009, 0.033672574907541275, 0.08822420984506607,
                -0.009559323079884052, -0.08002188056707382, -0.02796768955886364,
                0.04889626428484917, -0.002079806989058852, -0.12316332012414932,
                -0.00598991708829999, 0.04790058732032776, 0.08986284583806992,
                -0.06529728323221207, 0.0019114370224997401, -0.03926361724734306,
                0.043254926800727844, -0.016697514802217484, 0.06446542590856552,
                -0.015036128461360931, 0.048525601625442505, 0.022319965064525604,
                0.04527026414871216, -0.020831571891903877, -0.08953225612640381,
                -0.006588423624634743, 0.1359531283378601, -0.002234226791188121,
                -0.030231744050979614, 0.1041426882147789, -0.11253884434700012, 0.0400945320725441,
                0.0055610924027860165, 0.19018787145614624, -0.17008160054683685,
                0.021101707592606544, -0.00634838966652751, -0.013233933597803116,
                0.043402597308158875, 0.0033622318878769875, -0.06131330132484436,
                -0.056475479155778885, 0.0574350506067276, 0.015077848918735981,
                0.034125734120607376, 0.07870019972324371, -0.027285316959023476,
                0.05490930378437042, 0.05595440790057182, 0.019953204318881035,
                -0.047013092786073685, 0.061499033123254776, 0.02760140411555767,
                -0.006400404032319784, -0.01763268932700157, -0.01890098862349987,
                0.0064741335809230804, 0.03504158556461334, 0.001586462720297277,
                0.06483786553144455, -0.0428876094520092, -0.032916028052568436,
                0.01864536665380001, 0.06462439149618149, 0.0023124387953430414,
                0.08506456017494202, -0.06751906871795654, -0.027384648099541664,
                -0.037361446768045425, -0.02647651731967926, 0.05260567367076874,
                -0.014446704648435116, 0.06518206745386124, 0.08603981137275696,
                0.09696471691131592, 0.0062536210753023624, 0.048122942447662354,
                0.017186813056468964, 0.026083774864673615, 0.019874846562743187,
                0.07057034224271774, -0.02904350310564041, -0.05003984272480011,
                -0.01425819844007492, -0.001251187059096992, 0.04657392203807831,
                0.007774615194648504, -0.09506087750196457, -0.020778952166438103,
                -0.07087522745132446, -0.024529092013835907, -0.0887717679142952,
                -0.060240041464567184, 0.020624155178666115, 0.046308714896440506,
                -0.040538158267736435, -0.09442443400621414, -0.06354733556509018,
                0.006772881373763084, 0.06922020763158798, -0.00778896315023303,
                -0.021353259682655334, -0.124875009059906, 0.004535881336778402,
                -0.06257758289575577, 0.036274638026952744, 0.006892743986099958,
                -0.021391555666923523, -0.015682250261306763, -0.04881167784333229,
                0.01879616267979145, -0.014313933439552784, -0.002905568340793252,
                -0.07575004547834396, -0.06220642849802971, -0.032436590641736984,
                -0.006158924195915461, -0.002058455953374505, -0.05558959022164345,
                -0.005457794759422541, 0.04193447530269623, 0.063014455139637,
                -0.027310015633702278, -0.03688542917370796, 0.0466887503862381,
                -0.012773402035236359, -0.009203986264765263, 0.08859669417142868,
                -0.016090862452983856, 0.02242548018693924, -0.02983110584318638,
                -0.07793480902910233, -0.033489566296339035, 0.01613295078277588,
                -0.03415980935096741, 0.03627980500459671, -0.016666151583194733,
                0.025052055716514587, -0.03267792984843254, 0.020628737285733223,
                0.03692276030778885, -0.02742244303226471, -0.09069464355707169,
                -0.04986213520169258, 0.1718524694442749, 0.00028678213129751384,
                -0.0322076715528965, 0.02312176674604416, -0.06042476370930672, 0.05028273165225983,
                -0.00551630137488246, 0.012767993845045567, 0.032750293612480164,
                0.10601982474327087, -0.0063768420368433, 0.033016130328178406, 0.05911942943930626,
                -0.0034290996845811605, 0.04406482353806496, 0.06185388192534447,
                0.4226973056793213, -0.1968797892332077, 0.0842713937163353, 0.10632825642824173,
                0.0010914724553003907, 0.039177585393190384, -0.0801040455698967,
                0.04901694133877754, 0.08682584017515182, 0.10728341341018677, 0.13156089186668396,
                -0.018922606483101845, 0.019393766298890114, -0.04106520488858223,
                0.08649475127458572, -0.029056930914521217, -0.0071672541089355946,
                -0.018303148448467255, -0.06217241659760475, -0.004366402048617601,
                0.047536689788103104, -0.031071506440639496, -0.00480313366279006,
                -0.0061461725272238255, -0.055548787117004395, 0.00788793247193098,
                0.057616639882326126, 0.031225956976413727, 0.01318689901381731,
                0.015787797048687935, -0.019895801320672035, 0.03961948677897453,
                0.025899363681674004, 0.014753241091966629, -0.1348978728055954,
                0.03202307969331741, -0.05162663385272026, -0.13509045541286469,
                0.09003769606351852, -0.003307627746835351, 0.05749477818608284,
                0.06454337388277054, -0.021481366828083992, 0.028288818895816803,
                -0.026615282520651817, -0.026294425129890442, 0.008199688978493214,
                0.06729302555322647, 0.025896921753883362, 0.07375463098287582, 0.16271694004535675,
                -0.041269026696681976, -0.015906035900115967, -0.08949262648820877,
                0.05659450963139534, 0.13324247300624847, -0.0464564673602581,
                -0.005015434231609106, -0.001693259458988905, -0.002847062423825264,
                -0.013766842894256115, -0.07604783028364182, -0.05830862745642662,
                -0.02066342532634735, -0.06560307741165161, 0.08522600680589676,
                0.04107437655329704, -0.04214470461010933, -0.14534230530261993,
                -0.011104445904493332, -0.032366808503866196, 0.03278728947043419,
                0.11380184441804886, -0.0666615441441536, 0.040425315499305725,
                -0.005399531219154596, 0.014014272950589657, 0.023620227351784706,
                -0.07893305271863937, -0.009794498793780804, -0.08585638552904129,
                0.03401630371809006, 0.07119400054216385, 0.06484425067901611, -0.04560472443699837,
                0.10027354955673218, -0.09807371348142624, 0.09029466658830643,
                -0.00776924192905426, -0.05461972951889038, 0.048991065472364426,
                -0.039878834038972855, 0.019989730790257454, 0.019362283870577812,
                -0.04829762503504753, 0.06533920019865036, -0.017562834545969963,
                -0.05175589397549629, -0.07299955189228058, -0.07298615574836731,
                -0.04072772338986397, -0.09242146462202072, 0.07381884753704071,
                -0.06534093618392944, 0.0010574118932709098, -0.020853906869888306,
                -0.040836818516254425, -0.012832515873014927, 0.02487863413989544,
                0.03318801149725914, -0.15873613953590393, -0.055572014302015305,
                -0.021044636145234108, 0.03568285331130028, 0.017814001068472862,
                -0.0451168566942215, 0.005319114774465561, 0.057521238923072815,
                0.034872833639383316, 0.03899437189102173, 0.023746006190776825,
                -0.051500916481018066, 0.059377770870923996, -0.14109168946743011,
                -0.3940942585468292, 0.04678523913025856, 0.006228484213352203, 0.02189958095550537,
                -0.015611437149345875, -0.05416549742221832, 0.05052398517727852,
                0.0026056349743157625, -0.03473886474967003, 0.0980633795261383,
                -0.07380123436450958, 0.017081940546631813, -0.061888162046670914,
                -0.060919493436813354, -0.02053762413561344, -0.07007520645856857,
                -0.049346838146448135, 0.041981007903814316, 0.025222048163414,
                -0.06693807244300842, -0.08524662256240845, 0.06733603030443192,
                -0.021311646327376366, -0.003399507375434041, 0.0076775881461799145,
                0.024136727675795555, -0.07568683475255966, -0.06720703840255737,
                -0.016028104349970818, 0.061864208430051804, 0.03237927332520485,
                -0.07795371860265732, -0.005399972666054964, 0.038687314838171005,
                0.003363342024385929, 0.10057994723320007, 0.003988614305853844,
                -0.015340202488005161, -0.08878466486930847, 0.0977032408118248,
                0.06695879250764847, 0.18500442802906036, -0.01678348518908024,
                0.006111804861575365, 0.004242830444127321, 0.11370434612035751,
                0.03940612077713013, 0.013183747418224812, -0.030457524582743645,
                0.01693480648100376, -0.018341096118092537, -0.013356991112232208,
                0.09827983379364014, -0.05066269263625145, -0.027613507583737373,
                0.01687728427350521, -0.01242680475115776, -0.023277008906006813,
                -0.03319449722766876, 0.21616916358470917, 0.03379783406853676,
                0.042088836431503296, 0.017735781148076057, -0.03290579095482826,
                0.017938842996954918, -0.10539724677801132, -0.11517835408449173,
                -0.013451620005071163, 0.000374626339180395, 0.021733524277806282,
                -0.05304350331425667, -0.09813041239976883, -0.027155568823218346,
                0.013767196796834469, -0.01930530183017254, 0.10336603969335556,
                -0.021463418379426003, 0.03581016883254051, -0.06046905741095543,
                0.13518653810024261, 0.031003080308437347, 0.017072312533855438,
                0.011110997758805752, 0.0667453482747078, 0.04917195439338684,
                -0.0021193886641412973, -0.051941823214292526, -0.05759355053305626,
                0.020791461691260338, 0.13696010410785675, -0.04596574977040291, 0.1332692801952362,
                0.02513316459953785, -0.009932330809533596, -0.054872483015060425,
                0.03171728178858757, 0.013050459325313568, -0.003947978373616934,
                -0.44521331787109375, -0.05231727287173271, 0.1282065063714981,
                -0.030108973383903503, 0.025894753634929657, 0.09331361204385757,
                0.03157180920243263, -0.07923457771539688, -0.030358143150806427,
                -0.05153513327240944, 0.11359219998121262, 0.010586780495941639,
                0.06787595897912979, -0.13399849832057953, 0.02302604913711548, 0.08097248524427414,
                -0.043132904917001724, -0.01535704080015421, 0.05189881846308708,
                -0.2099890559911728, -0.004585218150168657, -0.05359213426709175,
                0.11603052169084549, 0.019611136987805367, 0.03128006309270859, 0.09810841828584671,
                -0.06763505190610886, 0.02503429353237152, 0.054650451987981796,
                0.002728505292907357, 0.06416928023099899, 0.006461964920163155,
                -0.02583378739655018, 0.10828322172164917, 0.08189579099416733, 0.03860188275575638,
                -0.03500935435295105, 12.041316986083984, 0.07135587930679321, 0.07587986439466476,
                -0.07815652340650558, 0.01789211481809616, -0.06088171899318695,
                0.042837608605623245, -0.08220500499010086, 0.0217966940253973, 0.1364554613828659,
                0.0007437678868882358, -0.04616783931851387, -0.029968850314617157,
                -0.07923655956983566, 0.03229570388793945, -0.02203737199306488,
                -0.04797447845339775, -0.0020305009093135595, 0.024356653913855553,
                -0.03915480151772499, -0.06702367961406708, 0.013569020666182041,
                0.07913649827241898, -0.0034444101620465517, -0.04820480942726135,
                0.028118645772337914, 0.02363363839685917, -0.016757983714342117,
                -0.01822235994040966, 0.06246187165379524, -0.02062375284731388,
                0.0004203618736937642, 0.03233122453093529, -0.030118217691779137,
                0.06812857836484909, 0.06541542708873749, 0.0953434482216835, 0.03266927972435951,
                0.0185119416564703, 0.04870273172855377, 0.020875677466392517, 0.005300997290760279,
                0.02631889097392559, 0.06798504292964935, 0.05154086649417877, 0.015005327761173248,
                0.017745381221175194, 0.12363690137863159, 0.013060785830020905,
                0.08051296323537827, 0.09826701134443283, -0.01794828288257122, 0.11512423306703568,
                0.022138921543955803, -0.016594456508755684, 0.013868294656276703,
                0.006469572428613901, -0.09581004828214645, 0.12190597504377365,
                0.05028713122010231, -0.046826597303152084, 0.10982882231473923,
                0.025811506435275078, 0.11328303813934326, 0.014556948095560074,
                0.08173282444477081, 0.0457267165184021, 0.07863391190767288, -0.14725281298160553,
                -0.07506497949361801, 0.023782463744282722, -0.07605893164873123,
                -0.08246233314275742, 0.08330795168876648, 0.10566451400518417,
                -0.04493102803826332, 0.07607607543468475, -0.04333483800292015,
                0.003520787926390767, -0.05823725461959839, 0.009233443066477776,
                0.024135639891028404, -0.03351334109902382, 0.042286068201065063,
                0.04909465089440346, 0.033163342624902725, 0.08282016962766647, 0.07227231562137604,
                0.046822961419820786, -0.05663175508379936, -0.0007530542206950486,
                0.10325410962104797, -0.006014158949255943, -0.05423947051167488,
                0.003947563003748655, -0.04840860143303871, 0.0478232316672802, -0.1463749259710312,
                0.068173848092556, 0.08410429209470749, -0.05504782497882843, -0.023465273901820183,
                -0.028513863682746887, 0.04851672425866127, 0.0020922934636473656,
                0.03378622606396675, -0.05709858611226082, 0.0017180262366309762,
                0.010725595988333225, 0.0572512112557888, -0.02881232462823391, 0.10155069082975388,
                0.07183052599430084, -0.04418819025158882, 0.07062981277704239, 0.05435023829340935,
                -0.03762836754322052, -0.018741268664598465, 0.04699109122157097,
                0.0607602559030056, -0.05994049087166786, -0.02827439457178116,
                -0.02400636114180088, -0.051030974835157394, -0.03479217365384102,
                -0.03554803878068924, -0.015273932367563248, 0.00006777645467082039,
                -0.024866431951522827, -0.024908997118473053, 0.04018652066588402,
                0.061754241585731506, 0.062193069607019424, -0.0466693639755249,
                0.039988692849874496, -0.06996554136276245, -0.034812234342098236,
                0.04701513424515724, 0.05103026703000069, 0.0690593495965004, -0.0636117234826088,
                -0.045921146869659424, -0.05381940305233002, -0.13033494353294373,
                0.02399160899221897, 0.09703382849693298, 0.05136001110076904, 0.02009364403784275,
                0.0055291480384767056, -0.06774132698774338, -0.05190951004624367,
                0.0539257638156414, 0.10736360400915146, 0.02136417292058468, 0.04460662975907326,
                -0.052776917815208435, -0.029110541567206383, 0.10957958549261093,
                -0.05377667769789696, 0.013081823475658894, -0.005934875924140215,
                -0.04737425222992897, 0.07549577951431274, 0.13798557221889496,
                0.013311639428138733, 0.04293627664446831, 0.06811729818582535,
                -0.006506450939923525, 0.04009142145514488, -0.009688236750662327,
                0.016802940517663956, -0.02174876444041729, -0.0929674506187439,
                -0.05609692260622978, 0.03033480793237686, 0.11118770390748978, 0.03098963014781475,
                -0.13081684708595276, -0.01888337731361389, -0.042367786169052124,
              ],
            },
            flagged_dissimilar_incidents: [],
            incident_id: 50,
            nlp_similar_incidents: [
              {
                __typename: 'IncidentNlp_similar_incident',
                incident_id: 38,
                similarity: 0.9988240599632263,
              },
              {
                __typename: 'IncidentNlp_similar_incident',
                incident_id: 6,
                similarity: 0.9987120628356934,
              },
              {
                __typename: 'IncidentNlp_similar_incident',
                incident_id: 26,
                similarity: 0.9986885786056519,
              },
            ],
            reports: [
              {
                __typename: 'Report',
                report_number: 905,
              },
              {
                __typename: 'Report',
                report_number: 903,
              },
              {
                __typename: 'Report',
                report_number: 902,
              },
              {
                __typename: 'Report',
                report_number: 901,
              },
              {
                __typename: 'Report',
                report_number: 900,
              },
              {
                __typename: 'Report',
                report_number: 899,
              },
              {
                __typename: 'Report',
                report_number: 898,
              },
              {
                __typename: 'Report',
                report_number: 897,
              },
              {
                __typename: 'Report',
                report_number: 896,
              },
              {
                __typename: 'Report',
                report_number: 893,
              },
              {
                __typename: 'Report',
                report_number: 892,
              },
              {
                __typename: 'Report',
                report_number: 889,
              },
              {
                __typename: 'Report',
                report_number: 888,
              },
              {
                __typename: 'Report',
                report_number: 887,
              },
              {
                __typename: 'Report',
                report_number: 886,
              },
              {
                __typename: 'Report',
                report_number: 885,
              },
              {
                __typename: 'Report',
                report_number: 884,
              },
              {
                __typename: 'Report',
                report_number: 883,
              },
              {
                __typename: 'Report',
                report_number: 881,
              },
              {
                __typename: 'Report',
                report_number: 880,
              },
              {
                __typename: 'Report',
                report_number: 879,
              },
              {
                __typename: 'Report',
                report_number: 878,
              },
              {
                __typename: 'Report',
                report_number: 877,
              },
              {
                __typename: 'Report',
                report_number: 876,
              },
              {
                __typename: 'Report',
                report_number: 25,
              },
              {
                __typename: 'Report',
                report_number: 24,
              },
              {
                __typename: 'Report',
                report_number: 23,
              },
              {
                __typename: 'Report',
                report_number: 22,
              },
              {
                __typename: 'Report',
                report_number: 21,
              },
              {
                __typename: 'Report',
                report_number: 20,
              },
              {
                __typename: 'Report',
                report_number: 19,
              },
              {
                __typename: 'Report',
                report_number: 18,
              },
              {
                __typename: 'Report',
                report_number: 17,
              },
              {
                __typename: 'Report',
                report_number: 16,
              },
            ],
            title: 'The DAO Hack',
          },
        },
      }
    );
    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'InsertDuplicate',
      'insertDuplicate',
      {
        data: {
          insertOneDuplicate: {
            __typename: 'Duplicate',
            duplicate_incident_number: 10,
            true_incident_number: 50,
          },
        },
      }
    );

    cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));
    cy.waitForStableDOM();

    cy.visit('/cite/10');
    cy.waitForStableDOM();

    cy.get('[data-cy="remove-duplicate"]').click();
    cy.waitForStableDOM();

    cy.get('#input-duplicateIncidentId').type('50');
    cy.waitForStableDOM();

    cy.get('#duplicateIncidentId > a[aria-label="50"]').click();
    cy.waitForStableDOM();

    cy.get('[data-cy="confirm-remove-duplicate"]').click();
    cy.waitForStableDOM();

    cy.contains('Incident 10 marked as duplicate').should('exist');
  });

  it('Should pre-fill submit report form', () => {
    cy.visit(url);

    cy.contains('New Report').scrollIntoView().click();

    cy.waitForStableDOM();

    cy.contains('[data-cy="prefilled-incident-id"]', 'Adding a new report to incident 10').should(
      'be.visible'
    );

    cy.get(`.incident-ids-field [data-cy="token"]`).contains('10').should('be.visible');
  });

  it('Should pre-fill submit report response form', () => {
    cy.visit(url);

    cy.contains('New Response').scrollIntoView().click();

    cy.waitForStableDOM();

    cy.contains('[data-cy="prefilled-incident-id"]', 'Adding a new response to incident 10').should(
      'be.visible'
    );

    cy.get(`.incident-ids-field [data-cy="token"]`).contains('10').should('be.visible');
  });

  it('should render Next and Previous incident buttons', () => {
    cy.visit(url);

    cy.contains('Next Incident').should('be.visible').should('have.attr', 'href', '/cite/11');

    cy.contains('Previous Incident').should('be.visible').should('have.attr', 'href', '/cite/9');
  });

  maybeIt('Should show the edit incident form', () => {
    cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));

    cy.visit(url);

    cy.waitForStableDOM();

    cy.contains('Edit Incident').click();

    cy.waitForStableDOM();

    cy.url().should('contain', '/incidents/edit/?incident_id=10');

    cy.waitForStableDOM();

    cy.get('[data-cy="incident-form"]', { timeout: 20000 }).should('be.visible');
  });

  it('Should display correct BibTex Citation', { retries: { runMode: 4 } }, () => {
    cy.visit(url);

    const date = format(new Date(), 'MMMMd,y');

    cy.waitForStableDOM();

    cy.contains('button', 'Citation Info').click();

    cy.waitForStableDOM();

    cy.get('[data-cy="citation-info-modal"]', { timeout: 15000 }).should('be.visible');

    cy.get('[data-cy="bibtex-format"]', { timeout: 15000 })
      .find('code')
      .invoke('text')
      .then((text) => {
        // would be nice not having to remove especial characters
        // eslint-disable-next-line
        const bibText = text.replace(/(\r\n|\n|\r| |\s)/g, '');

        expect(bibText).to.eq(
          `@article{aiid:10,author={Olsson,Catherine},editor={McGregor,Sean},journal={AIIncidentDatabase},publisher={ResponsibleAICollaborative},title={IncidentNumber10},url={https://incidentdatabase.ai/cite/10},year={2014},urldate={${date}}}`
        );
      });
  });

  it('Should display correct Citation', () => {
    cy.visit(url);

    const date = format(new Date(), 'MMMM d, y');

    cy.waitForStableDOM();

    cy.contains('button', 'Citation Info').click();

    cy.waitForStableDOM();

    cy.get('[data-cy="suggested-citation-format"]').should(
      'contain.text',
      `Olsson, Catherine. (2014-08-14) Incident Number 10. in McGregor, S. (ed.) Artificial Intelligence Incident Database. Responsible AI Collaborative. Retrieved on ${date} from incidentdatabase.ai/cite/10.`
    );
  });

  it('Should display similar incidents', () => {
    cy.visit('/cite/9');

    cy.get('[data-cy="similar-incident-card"]').should('exist');
  });

  it('Should display similar incidents with localized links', () => {
    cy.visit('/es/cite/9');

    cy.get('[data-cy="similar-incident-card"]').should('exist');

    cy.get('.tw-main-container [data-cy="similar-incident-card"] > [data-cy="cite-link"]').each(
      (link) => {
        const href = link[0].href;

        expect(href).to.contains('/es/cite/');
      }
    );
  });

  it('Should not display duplicate similar incidents', () => {
    cy.visit('/cite/9');

    const hrefs = new Set();

    cy.get('.tw-main-container [data-cy="similar-incident-card"] > [data-cy="cite-link"]').each(
      (link) => {
        const href = link[0].href;

        expect(hrefs.has(href)).to.be.false;
        hrefs.add(href);
      }
    );
  });

  it('Should not display edit link when not logged in', () => {
    cy.visit('/cite/9');

    cy.get('[data-cy="edit-similar-incidents"]').should('not.exist');
  });

  maybeIt('Should display edit link when logged in as editor', () => {
    cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));

    cy.visit('/cite/9');

    cy.get('[data-cy="edit-similar-incidents"]').should('exist');
  });

  it('Should flag an incident as not related (not authenticated)', () => {
    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindIncident',
      'findIncident',
      incident10
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'UpdateIncident',
      'updateIncident',
      updateOneIncidentFlagged
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'logIncidentHistory',
      'logIncidentHistory',
      {
        data: {
          logIncidentHistory: {
            incident_id: 9,
          },
        },
      }
    );

    cy.visit('/cite/9');

    cy.wait('@findIncident', { timeout: 10000 });

    cy.waitForStableDOM();

    const now = new Date();

    cy.clock(now);

    cy.get('[data-cy="flag-similar-incident"]').first().click();

    cy.wait('@updateIncident', { timeout: 8000 }).then((xhr) => {
      expect(xhr.request.body.variables.query).deep.eq({ incident_id: 9 });
      expect(xhr.request.body.variables.set).to.deep.eq({
        flagged_dissimilar_incidents: [11],
        epoch_date_modified: getUnixTime(now),
        editors: { link: incident10.data.incident.editors.map((e) => e.userId) },
      });
    });

    cy.wait('@logIncidentHistory')
      .its('request.body.variables.input')
      .then((input) => {
        const expectedIncident = deleteIncidentTypenames(
          transformIncidentData(incident10.data.incident)
        );

        expectedIncident.flagged_dissimilar_incidents = [11];
        expectedIncident.epoch_date_modified = getUnixTime(now);
        expectedIncident.modifiedBy = '';

        expect(input).to.deep.eq(expectedIncident);
      });
  });

  maybeIt('Should flag an incident as not related (authenticated)', () => {
    cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindIncident',
      'findIncident',
      incident10
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'UpdateIncident',
      'updateIncident',
      updateOneIncidentFlagged
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'logIncidentHistory',
      'logIncidentHistory',
      {
        data: {
          logIncidentHistory: {
            incident_id: 9,
          },
        },
      }
    );

    cy.visit('/cite/9');

    cy.wait('@findIncident', { timeout: 10000 });

    cy.waitForStableDOM();

    const now = new Date();

    cy.clock(now);

    cy.get('[data-cy="flag-similar-incident"]').first().click();

    cy.wait('@updateIncident', { timeout: 8000 }).then((xhr) => {
      expect(xhr.request.body.variables.query).deep.eq({ incident_id: 9 });
      expect(xhr.request.body.variables.set).to.deep.eq({
        flagged_dissimilar_incidents: [],
        epoch_date_modified: getUnixTime(now),
        editors: { link: [...incident10.data.incident.editors.map((e) => e.userId), user.userId] },
      });
    });

    cy.wait('@logIncidentHistory')
      .its('request.body.variables.input')
      .then((input) => {
        const expectedIncident = deleteIncidentTypenames(
          transformIncidentData(incident10.data.incident)
        );

        expectedIncident.flagged_dissimilar_incidents = [];
        expectedIncident.epoch_date_modified = getUnixTime(now);
        expectedIncident.modifiedBy = user.userId;
        expectedIncident.editors = [
          ...incident10.data.incident.editors.map((e) => e.userId),
          user.userId,
        ];

        expect(input).to.deep.eq(expectedIncident);
      });
  });

  it('Should have OpenGraph meta tags', () => {
    cy.visit(url);

    cy.query({
      query: gql`
        query {
          incidents(query: { incident_id: ${incidentId} }, limit: 1) {
            title
            description
            reports {
              image_url
              date_published
            }
          }
        }
      `,
    }).then(({ data: { incidents } }) => {
      const incident = incidents[0];

      const title = `Incident ${incidentId}: ${incident.title}`;

      const description = incident.description;

      cy.get('head meta[name="title"]').should('have.attr', 'content', title);
      cy.get('head meta[name="description"]').should('have.attr', 'content', description);

      cy.get('head meta[name="twitter:site"]').should('have.attr', 'content', '@IncidentsDB');
      cy.get('head meta[name="twitter:creator"]').should('have.attr', 'content', '@IncidentsDB');

      cy.get('head meta[property="og:url"]').should(
        'have.attr',
        'content',
        `https://incidentdatabase.ai${url}/`
      );
      cy.get('head meta[property="og:type"]').should('have.attr', 'content', 'website');
      cy.get('head meta[property="og:title"]').should('have.attr', 'content', title);
      cy.get('head meta[property="og:description"]').should('have.attr', 'content', description);
      cy.get('head meta[property="og:image"]').first().should('have.attr', 'content');
      cy.get('head meta[property="twitter:title"]').should('have.attr', 'content', title);
      cy.get('head meta[property="twitter:description"]').should(
        'have.attr',
        'content',
        description
      );
      cy.get('head meta[property="twitter:image"]').should('have.attr', 'content');
    });
  });

  maybeIt('Should subscribe to incident updates (user authenticated)', () => {
    cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));

    cy.visit('/cite/51');

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'UpsertSubscription',
      'upsertSubscription',
      {
        data: {
          upsertOneSubscription: {
            _id: 'dummyIncidentId',
          },
        },
      }
    );

    cy.waitForStableDOM();

    cy.contains('Notify Me of Updates').scrollIntoView().click();

    cy.get('[data-cy="toast"]', { timeout: 15000 }).should('be.visible');

    cy.contains(
      '[data-cy="toast"]',
      `You have successfully subscribed to updates on incident 51`
    ).should('be.visible');
  });

  it('Should not subscribe to incident updates (user unauthenticated)', () => {
    cy.visit(url);

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'UpsertSubscription',
      'upsertSubscription',
      {
        data: {
          upsertOneSubscription: {
            _id: 'dummyIncidentId',
          },
        },
      }
    );

    cy.waitForStableDOM();

    cy.contains('Notify Me of Updates').scrollIntoView().click();

    cy.get('[data-cy="toast"]', { timeout: 15000 }).should('be.visible');

    cy.get('[data-cy="toast"]').contains(`Please log in to subscribe`).should('be.visible');
  });

  it('Should show proper entities card text', () => {
    cy.visit('/cite/67/');

    cy.get('[data-cy="alleged-entities"]').should(
      'have.text',
      'Alleged: Tesla developed an AI system deployed by Tesla and Motorist, which harmed Motorists.'
    );

    cy.visit('/cite/72/');

    cy.get('[data-cy="alleged-entities"]').should(
      'have.text',
      'Alleged: Facebook developed and deployed an AI system, which harmed unnamed Palestinian Facebook user , Palestinian Facebook users , Arabic-speaking Facebook users and Facebook users.'
    );

    cy.visit('/cite/30');

    cy.get('[data-cy="alleged-entities"]').should(
      'have.text',
      'Alleged: Tesla developed and deployed an AI system, which harmed Tesla.'
    );
  });

  it('Should display response in timeline and as badge', () => {
    cy.visit('/cite/51#r1765');

    cy.get('#r1765')
      .scrollIntoView()
      .contains('post-incident response', { timeout: 8000 })
      .should('exist');

    cy.get('[data-cy="responded-badge"]').should('exist');

    cy.get('[data-cy="timeline-text-response"]').should('exist');
  });

  it('Should not display response in timeline or in badge', () => {
    cy.visit('/cite/1');

    cy.get('[data-cy="responded-badge"]').should('not.exist');

    cy.get('[data-cy="timeline-text-response"]').should('not.exist');
  });

  it('There should not be image errors (400)', () => {
    cy.visit(url, {
      onBeforeLoad(win) {
        cy.stub(win.console, 'error').as('consoleError');
      },
    });

    cy.waitForStableDOM();

    cy.get('@consoleError').then((consoleError) => {
      const noImagesErrors = consoleError
        .getCalls()
        .every((call) =>
          call.args.every(
            (arg) => !(arg.includes('https://res.cloudinary.com') && arg.includes('400'))
          )
        );

      expect(noImagesErrors, 'No images errors').to.be.true;
    });
  });

  it('Should not display edit link when not logged in', () => {
    cy.visit(url);

    cy.get('[data-cy="clone-incident-btn"]').should('not.exist');
  });

  maybeIt('Should clone incident opening the preloaded new Incident form', () => {
    cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));

    cy.visit(url);

    cy.contains('Clone Incident').click();

    cy.waitForStableDOM();

    cy.url().should('contain', `/incidents/new/?incident_id=${incidentId}`);

    cy.get('[data-cy="incident-form"]', { timeout: 8000 }).should('be.visible');
  });
});
