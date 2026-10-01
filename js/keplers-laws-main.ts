// Copyright 2023-2026, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

// Must be first: sets Kantumruy Pro before any PhetFont is constructed at import time.
import './applyKantumruyFontFamily.js';

import DerivedProperty from '../../axon/js/DerivedProperty.js';
import localeProperty from '../../joist/js/i18n/localeProperty.js';
import PreferencesModel from '../../joist/js/preferences/PreferencesModel.js';
import Sim, { SimOptions } from '../../joist/js/Sim.js';
import simLauncher from '../../joist/js/simLauncher.js';
import { combineOptions } from '../../phet-core/js/optionize.js';
import PhetFont from '../../scenery-phet/js/PhetFont.js';
import HBox from '../../scenery/js/layout/nodes/HBox.js';
import TextPushButton from '../../sun/js/buttons/TextPushButton.js';
import Tandem from '../../tandem/js/Tandem.js';
import AllLawsScreen from './all-laws/AllLawsScreen.js';
import KeplersLawsPreferencesNode from './common/view/KeplersLawsPreferencesNode.js';
import FirstLawScreen from './first-law/FirstLawScreen.js';
import KeplersLawsStrings from './KeplersLawsStrings.js';
import SecondLawScreen from './second-law/SecondLawScreen.js';
import ThirdLawScreen from './third-law/ThirdLawScreen.js';

const preferencesModel = new PreferencesModel( {
  visualOptions: {
    supportsProjectorMode: true
  },
  simulationOptions: {
    customPreferences: [ {
      createContent: tandem => new KeplersLawsPreferencesNode( tandem.createTandem( 'simPreferences' ) )
    } ]
  }
} );

const simOptions: SimOptions = {
  credits: {
    leadDesign: 'Diana López Tavares',
    softwareDevelopment: 'Agustín Vallejo, Jonathan Olson',
    team: 'Chris Malley (PixelZoom, Inc.), Emily B. Moore, Kathy Perkins, Ariel Paul, Amy Rouinfar',
    qualityAssurance: 'Jaron Droder, Clifford Hardin, Nancy Salpepi, Kathryn Woessner',
    graphicArts: '',
    soundDesign: 'Ashton Morris',
    thanks: ''
  },
  preferencesModel: preferencesModel,
  phetioDesigned: true
};

const createLanguageSwitch = (): HBox => {
  const createLanguageButton = ( label: string, locale: 'km' | 'en', segment: 'left' | 'right' ): TextPushButton => {
    const isLeftSegment = segment === 'left';
    const selectedProperty = new DerivedProperty( [ localeProperty ], currentLocale => currentLocale === locale, {
      tandem: Tandem.OPT_OUT
    } );

    return new TextPushButton( label, {
      font: new PhetFont( { family: 'Kantumruy Pro', size: 16, weight: 'bold' } ),
      textFill: 'white',
      minWidth: 78,
      minHeight: 38,
      xMargin: 12,
      yMargin: 7,
      baseColor: localeProperty.value === locale ? '#087e73' : '#37464a',
      stroke: '#9aafb0',
      lineWidth: 1,
      cornerRadius: 0,
      leftTopCornerRadius: isLeftSegment ? 8 : 0,
      leftBottomCornerRadius: isLeftSegment ? 8 : 0,
      rightTopCornerRadius: isLeftSegment ? 0 : 8,
      rightBottomCornerRadius: isLeftSegment ? 0 : 8,
      accessibleRoleConfiguration: 'toggle',
      accessiblePressedProperty: selectedProperty,
      listener: () => { localeProperty.value = locale; },
      tandem: Tandem.ROOT.createTandem( `languageSwitch${locale === 'km' ? 'Khmer' : 'English'}` )
    } );
  };

  const khmerButton = createLanguageButton( 'ខ្មែរ', 'km', 'left' );
  const englishButton = createLanguageButton( 'English', 'en', 'right' );

  localeProperty.link( locale => {
    khmerButton.baseColor = locale === 'km' ? '#087e73' : '#37464a';
    englishButton.baseColor = locale === 'en' ? '#087e73' : '#37464a';
  } );

  return new HBox( { children: [ khmerButton, englishButton ], spacing: 0 } );
};

const launchSimulation = (): void => {
  localeProperty.value = 'km';

  const titleStringProperty = KeplersLawsStrings[ 'keplers-laws' ].titleStringProperty;

  const screens = [
    new FirstLawScreen( Tandem.ROOT.createTandem( 'firstLawScreen' ) ),
    new SecondLawScreen( Tandem.ROOT.createTandem( 'secondLawScreen' ) ),
    new ThirdLawScreen( Tandem.ROOT.createTandem( 'thirdLawScreen' ) ),
    new AllLawsScreen( Tandem.ROOT.createTandem( 'allLawsScreen' ) )
  ];

  const sim = new Sim( titleStringProperty, screens, combineOptions<SimOptions>( {}, simOptions, {
    homeScreenWarningNode: createLanguageSwitch()
  } ) );
  sim.start();
};

const kantumruyFont = new FontFace(
  'Kantumruy Pro',
  `url(${new URL( 'images/KantumruyProKhmer.woff2', window.location.href )})`,
  { weight: '100 900' }
);

kantumruyFont.load().then( loadedFont => {
  document.fonts.add( loadedFont );
  simLauncher.launch( launchSimulation );
} ).catch( error => {
  console.error( 'Unable to load Kantumruy Pro; using the default font.', error );
  simLauncher.launch( launchSimulation );
} );
