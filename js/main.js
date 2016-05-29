var map, bookmarks_el, bookmarks_jr, bookmarks_sr;
var updateFeature;

require([
  "esri/map",
  "esri/dijit/LocateButton",
  "esri/layers/FeatureLayer",
  "esri/dijit/AttributeInspector",
  "esri/symbols/SimpleLineSymbol",
  "esri/symbols/SimpleFillSymbol",
  "esri/Color",
  "esri/layers/ArcGISDynamicMapServiceLayer",
  "esri/config",
  "esri/tasks/query",
  "esri/dijit/Bookmarks",
  "dojo/parser",
  "dojo/dom-construct",
  "dijit/form/Button",
  "dijit/layout/BorderContainer",
  "dijit/layout/ContentPane",
  "dijit/form/DropDownButton",
  "dojo/domReady!"
], function(
  Map, LocateButton, FeatureLayer, AttributeInspector,
  SimpleLineSymbol, SimpleFillSymbol, Color,
  ArcGISDynamicMapServiceLayer, esriConfig,
  Query, Bookmarks, parser,
  domConstruct, Button, DropDownButton
) {
  parser.parse();

  esriConfig.defaults.io.proxyUrl = "/proxy";

  var initExtent = new esri.geometry.Extent({"xmin":-12485775,"ymin":4944852,"xmax":-12433262,"ymax":4983300,"spatialReference":{"wkid":102100}});

  map = new Map("mapDiv", {
    basemap: "satellite",
    extent: initExtent,
    zoom: 12,
    logo: false
  });

  map.on("layers-add-result", initSelectToolbar);

  geoLocate = new LocateButton({map: map}, "LocateButton");
  geoLocate.startup();

  // var doorLayer = new FeatureLayer("http://services6.arcgis.com/GdLVqDxhedDYaLfo/ArcGIS/rest/services/Relos/FeatureServer/0");
  // var reloLayer = new FeatureLayer("http://services6.arcgis.com/GdLVqDxhedDYaLfo/ArcGIS/rest/services/Relos/FeatureServer/1");
  // map.addLayers([reloLayer, doorLayer]);

  var reloLayer = new ArcGISDynamicMapServiceLayer("http://www2.graniteschools.org/ArcGIS/rest/services/Relos/MapServer");
  reloLayer.setDisableClientCaching(true);
  map.addLayer(reloLayer);

  var reloLayerFL = new FeatureLayer("http://www2.graniteschools.org/ArcGIS/rest/services/Relos/FeatureServer/1", {
    mode: FeatureLayer.MODE_SELECTION,
    id: "Relo_Num",
    outFields: ["Relo_Num", "Sch_Name", "Description", "Manufacturer", "Year_Built", "Sq_Feet", "Size", "Notes"]
  });

  var el_list = [
  {"extent": {"spatialReference": {"wkid":102100},"xmin":-12468310,"ymin":4963507,"xmax":-12467115,"ymax":4964224},"name": "Academy Park" },
  {"extent": {"spatialReference": {"wkid":102100},"xmin":-12465401,"ymin":4962346,"xmax":-12464207,"ymax":4963063},"name": "Arcadia"},
  {"extent": {"spatialReference": {"wkid":102100},"xmin":-12469839,"ymin":4969557,"xmax":-12469018,"ymax":4970157},"name": "Armstrong"},
  {"extent": {"spatialReference": {"wkid":102100},"xmin":-12471769,"ymin":4959587,"xmax":-12470949,"ymax":4960188},"name": "Bacchus"},
  {"extent": {"spatialReference": {"wkid":102100},"xmin":-12469716,"ymin":4960306,"xmax":-12468896,"ymax":4960907},"name": "Beehive"},
  {"extent": {"spatialReference": {"wkid":102100},"xmin":-12463840,"ymin":4960028,"xmax":-12463019,"ymax":4960629},"name": "Bennion"},
  {"extent": {"spatialReference": {"wkid":102100},"xmin":-12470490,"ymin":4958384,"xmax":-12469670,"ymax":4958985},"name": "Bridger"},
  {"extent": {"spatialReference": {"wkid":102100},"xmin":-12476373,"ymin":4966493,"xmax":-12475553,"ymax":4967093},"name": "Copper Hills"},
  {"extent": {"spatialReference": {"wkid":102100},"xmin":-12447739,"ymin":4961550,"xmax":-12446918,"ymax":4962151},"name": "Cottonwood"},
  {"extent": {"spatialReference": {"wkid":102100},"xmin":-12449283,"ymin":4965014,"xmax":-12448463,"ymax":4965615},"name": "Crestview"},
  {"extent": {"spatialReference": {"wkid":102100},"xmin":-12472106,"ymin":4958639,"xmax":-12471286,"ymax":4959240},"name": "Diamond Ridge"},
  {"extent": {"spatialReference": {"wkid":102100},"xmin":-12447736,"ymin":4964485,"xmax":-12446915,"ymax":4965086},"name": "Driggs"},
  {"extent": {"spatialReference": {"wkid":102100},"xmin":-12445191,"ymin":4967761,"xmax":-12444370,"ymax":4968361},"name": "Eastwood"},
  {"extent": {"spatialReference": {"wkid":102100},"xmin":-12479028,"ymin":4967172,"xmax":-12478208,"ymax":4967773},"name": "Elk Run"},
  {"extent": {"spatialReference": {"wkid":102100},"xmin":-12467151,"ymin":4966524,"xmax":-12466330,"ymax":4967124},"name": "Farnsworth"},
  {"extent": {"spatialReference": {"wkid":102100},"xmin":-12466080,"ymin":4959140,"xmax":-12465259,"ymax":4959741},"name": "Fox Hills"},
  {"extent": {"spatialReference": {"wkid":102100},"xmin":-12460888,"ymin":4964718,"xmax":-12460067,"ymax":4965319},"name": "Fremont"},
  {"extent": {"spatialReference": {"wkid":102100},"xmin":-12465325,"ymin":4964317,"xmax":-12464505,"ymax":4964918},"name": "Frost"},
  {"extent": {"spatialReference": {"wkid":102100},"xmin":-12467367,"ymin":4962377,"xmax":-12466547,"ymax":4962978},"name": "Gourley"},
  {"extent": {"spatialReference": {"wkid":102100},"xmin":-12462032,"ymin":4966719,"xmax":-12461211,"ymax":4967320},"name": "Granger"},
  {"extent": {"spatialReference": {"wkid":102100},"xmin":-12464772,"ymin":4968242,"xmax":-12463951,"ymax":4968842},"name": "Hillsdale"},
  {"extent": {"spatialReference": {"wkid":102100},"xmin":-12471797,"ymin":4964689,"xmax":-12470977,"ymax":4965290},"name": "Hillside"},
  {"extent": {"spatialReference": {"wkid":102100},"xmin":-12470206,"ymin":4964365,"xmax":-12469385,"ymax":4964966},"name": "Hunter"},
  {"extent": {"spatialReference": {"wkid":102100},"xmin":-12468441,"ymin":4966434,"xmax":-12467620,"ymax":4967035},"name": "Jackling"},
  {"extent": {"spatialReference": {"wkid":102100},"xmin":-12475771,"ymin":4967761,"xmax":-12474950,"ymax":4968362},"name": "Lake Ridge"},
  {"extent": {"spatialReference": {"wkid":102100},"xmin":-12454775,"ymin":4966521,"xmax":-12453955,"ymax":4967121},"name": "Lincoln"},
  {"extent": {"spatialReference": {"wkid":102100},"xmin":-12478722,"ymin":4968520,"xmax":-12477901,"ymax":4969121},"name": "Magna"},
  {"extent": {"spatialReference": {"wkid":102100},"xmin":-12452411,"ymin":4966271,"xmax":-12451591,"ymax":4966871},"name": "Mill Creek"},
  {"extent": {"spatialReference": {"wkid":102100},"xmin":-12467902,"ymin":4968653,"xmax":-12467082,"ymax":4969254},"name": "Monroe"},
  {"extent": {"spatialReference": {"wkid":102100},"xmin":-12446642,"ymin":4965144,"xmax":-12445822,"ymax":4965745},"name": "Morningside"},
  {"extent": {"spatialReference": {"wkid":102100},"xmin":-12454329,"ymin":4964390,"xmax":-12453509,"ymax":4964991},"name": "Moss"},
  {"extent": {"spatialReference": {"wkid":102100},"xmin":-12444704,"ymin":4964551,"xmax":-12443884,"ymax":4965151},"name": "Oakridge"},
  {"extent": {"spatialReference": {"wkid":102100},"xmin":-12449658,"ymin":4959862,"xmax":-12448838,"ymax":4960462},"name": "Oakwood"},
  {"extent": {"spatialReference": {"wkid":102100},"xmin":-12467268,"ymin":4961306,"xmax":-12466448,"ymax":4961907},"name": "Oquirrh Hills"},
  {"extent": {"spatialReference": {"wkid":102100},"xmin":-12473987,"ymin":4966436,"xmax":-12473167,"ymax":4967037},"name": "Orchard"},
  {"extent": {"spatialReference": {"wkid":102100},"xmin":-12450870,"ymin":4966567,"xmax":-12450049,"ymax":4967168},"name": "Penn"},
  {"extent": {"spatialReference": {"wkid":102100},"xmin":-12465189,"ymin":4966115,"xmax":-12464368,"ymax":4966716},"name": "Pioneer"},
  {"extent": {"spatialReference": {"wkid":102100},"xmin":-12477785,"ymin":4969188,"xmax":-12476965,"ymax":4969788},"name": "Pleasant Green"},
  {"extent": {"spatialReference": {"wkid":102100},"xmin":-12460642,"ymin":4961434,"xmax":-12459821,"ymax":4962035},"name": "Plymouth"},
  {"extent": {"spatialReference": {"wkid":102100},"xmin":-12461549,"ymin":4969924,"xmax":-12460728,"ymax":4970524},"name": "Redwood"},
  {"extent": {"spatialReference": {"wkid":102100},"xmin":-12463986,"ymin":4965720,"xmax":-12463165,"ymax":4966321},"name": "Rolling Meadows"},
  {"extent": {"spatialReference": {"wkid":102100},"xmin":-12453383,"ymin":4967992,"xmax":-12452563,"ymax":4968593},"name": "Roosevelt"},
  {"extent": {"spatialReference": {"wkid":102100},"xmin":-12448236,"ymin":4968753,"xmax":-12447415,"ymax":4969353},"name": "Rosecrest"},
  {"extent": {"spatialReference": {"wkid":102100},"xmin":-12470333,"ymin":4966084,"xmax":-12469513,"ymax":4966685},"name": "Sandburg"},
  {"extent": {"spatialReference": {"wkid":102100},"xmin":-12471346,"ymin":4961941,"xmax":-12470525,"ymax":4962541},"name": "Silver Hills"},
  {"extent": {"spatialReference": {"wkid":102100},"xmin":-12462308,"ymin":4959051,"xmax":-12461488,"ymax":4959652},"name": "Smith"},
  {"extent": {"spatialReference": {"wkid":102100},"xmin":-12467825,"ymin":4960624,"xmax":-12467004,"ymax":4961225},"name": "South Kearns"},
  {"extent": {"spatialReference": {"wkid":102100},"xmin":-12450597,"ymin":4961159,"xmax":-12449777,"ymax":4961759},"name": "Spring Lane"},
  {"extent": {"spatialReference": {"wkid":102100},"xmin":-12463642,"ymin":4968665,"xmax":-12462822,"ymax":4969266},"name": "Stansbury"},
  {"extent": {"spatialReference": {"wkid":102100},"xmin":-12462026,"ymin":4964925,"xmax":-12461206,"ymax":4965526},"name": "Taylorsville"},
  {"extent": {"spatialReference": {"wkid":102100},"xmin":-12464399,"ymin":4963335,"xmax":-12463579,"ymax":4963935},"name": "Truman"},
  {"extent": {"spatialReference": {"wkid":102100},"xmin":-12452686,"ymin":4961221,"xmax":-12451866,"ymax":4961822},"name": "Twin Peaks"},
  {"extent": {"spatialReference": {"wkid":102100},"xmin":-12447308,"ymin":4966454,"xmax":-12446487,"ymax":4967055},"name": "Upland Terrace"},
  {"extent": {"spatialReference": {"wkid":102100},"xmin":-12470001,"ymin":4968616,"xmax":-12469181,"ymax":4969217},"name": "Valley Crest"},
  {"extent": {"spatialReference": {"wkid":102100},"xmin":-12462281,"ymin":4962426,"xmax":-12461460,"ymax":4963026},"name": "Vista"},
  {"extent": {"spatialReference": {"wkid":102100},"xmin":-12468447,"ymin":4962340,"xmax":-12467626,"ymax":4962940},"name": "West Kearns"},
  {"extent": {"spatialReference": {"wkid":102100},"xmin":-12472178,"ymin":4968406,"xmax":-12471357,"ymax":4969006},"name": "West Valley"},
  {"extent": {"spatialReference": {"wkid":102100},"xmin":-12465239,"ymin":4958693,"xmax":-12464418,"ymax":4959294},"name": "Westbrook"},
  {"extent": {"spatialReference": {"wkid":102100},"xmin":-12469386,"ymin":4961426,"xmax":-12468565,"ymax":4962027},"name": "Western Hills"},
  {"extent": {"spatialReference": {"wkid":102100},"xmin":-12471923,"ymin":4967177,"xmax":-12471103,"ymax":4967778},"name": "Whittier"},
  {"extent": {"spatialReference": {"wkid":102100},"xmin":-12455919,"ymin":4970037,"xmax":-12455099,"ymax":4970638},"name": "Wilson"},
  {"extent": {"spatialReference": {"wkid":102100},"xmin":-12451851,"ymin":4959288,"xmax":-12451030,"ymax":4959889},"name": "Woodstock"},
  {"extent": {"spatialReference": {"wkid":102100},"xmin":-12474000,"ymin":4968589,"xmax":-12473179,"ymax":4969190},"name": "Wright"}
  ];

  var jr_list = [
  {"extent": {"spatialReference": {"wkid":102100},"xmin":-12463510,"ymin":4959078,"xmax":-12462315,"ymax":4959795},"name": "Bennion" },
  {"extent": {"spatialReference": {"wkid":102100},"xmin":-12451321,"ymin":4961132,"xmax":-12450127,"ymax":4961849},"name": "Bonneville"},
  {"extent": {"spatialReference": {"wkid":102100},"xmin":-12478683,"ymin":4968834,"xmax":-12477863,"ymax":4969435},"name": "Brockbank" },
  {"extent": {"spatialReference": {"wkid":102100},"xmin":-12445657,"ymin":4964476,"xmax":-12444836,"ymax":4965076},"name": "Churchill"},
  {"extent": {"spatialReference": {"wkid":102100},"xmin":-12461144,"ymin":4964277,"xmax":-12460324,"ymax":4964878},"name": "Eisenhower" },
  {"extent": {"spatialReference": {"wkid":102100},"xmin":-12449567,"ymin":4967553,"xmax":-12448747,"ymax":4968154},"name": "Evergreen"},
  {"extent": {"spatialReference": {"wkid":102100},"xmin":-12455303,"ymin":4968458,"xmax":-12454482,"ymax":4969059},"name": "Granite Park" },
  {"extent": {"spatialReference": {"wkid":102100},"xmin":-12472327,"ymin":4966132,"xmax":-12471507,"ymax":4966732},"name": "Hunter"},
  {"extent": {"spatialReference": {"wkid":102100},"xmin":-12471192,"ymin":4959816,"xmax":-12470372,"ymax":4960416},"name": "Jefferson" },
  {"extent": {"spatialReference": {"wkid":102100},"xmin":-12466943,"ymin":4961489,"xmax":-12466123,"ymax":4962090},"name": "Kearns"},
  {"extent": {"spatialReference": {"wkid":102100},"xmin":-12468611,"ymin":4963874,"xmax":-12467786,"ymax":4964475},"name": "Kennedy" },
  {"extent": {"spatialReference": {"wkid":102100},"xmin":-12476792,"ymin":4967005,"xmax":-12475971,"ymax":4967606},"name": "Matheson"},
  {"extent": {"spatialReference": {"wkid":102100},"xmin":-12449020,"ymin":4963196,"xmax":-12448199,"ymax":4963797},"name": "Olympus" },
  {"extent": {"spatialReference": {"wkid":102100},"xmin":-12464383,"ymin":4964925,"xmax":-12463563,"ymax":4965526},"name": "Valley"},
  {"extent": {"spatialReference": {"wkid":102100},"xmin":-12446643,"ymin":4966540,"xmax":-12445822,"ymax":4967141},"name": "Wasatch" },
  {"extent": {"spatialReference": {"wkid":102100},"xmin":-12465381,"ymin":4967769,"xmax":-12464561,"ymax":4968370},"name": "West Lake"}
  ];

  var sr_list = [
  {"extent": {"spatialReference": {"wkid":102100},"xmin":-12451904,"ymin":4959943,"xmax":-12450710,"ymax":4960660},"name": "Cottonwood" },
  {"extent": {"spatialReference": {"wkid":102100},"xmin":-12479394,"ymin":4968602,"xmax":-12478200,"ymax":4969319},"name": "Cyprus"},
  {"extent": {"spatialReference": {"wkid":102100},"xmin":-12466007,"ymin":4966959,"xmax":-12464813,"ymax":4967676},"name": "Granger" },
  {"extent": {"spatialReference": {"wkid":102100},"xmin":-12454546,"ymin":4966077,"xmax":-12453352,"ymax":4966793},"name": "Granite Peaks"},
  {"extent": {"spatialReference": {"wkid":102100},"xmin":-12471362,"ymin":4964878,"xmax":-12470168,"ymax":4965595},"name": "Hunter"},
  {"extent": {"spatialReference": {"wkid":102100},"xmin":-12468732,"ymin":4960401,"xmax":-12467538,"ymax":4961117},"name": "Kearns" },
  {"extent": {"spatialReference": {"wkid":102100},"xmin":-12448653,"ymin":4965573,"xmax":-12447458,"ymax":4966290},"name": "Olympus"},
  {"extent": {"spatialReference": {"wkid":102100},"xmin":-12446167,"ymin":4966585,"xmax":-12444973,"ymax":4967301},"name": "Skyline" },
  {"extent": {"spatialReference": {"wkid":102100},"xmin":-12461292,"ymin":4961281,"xmax":-12460097,"ymax":4961997},"name": "Taylorsville"}
  ];

  //Creates the bookmark widgets
  bookmarks_el = new esri.dijit.Bookmarks({map: map, bookmarks: el_list}, dojo.byId('bookmarks1'));
  bookmarks_jr = new esri.dijit.Bookmarks({map: map, bookmarks: jr_list}, dojo.byId('bookmarks2'));
  bookmarks_sr = new esri.dijit.Bookmarks({map: map, bookmarks: sr_list}, dojo.byId('bookmarks3'));

  var selectionSymbol = new SimpleFillSymbol(
    SimpleFillSymbol.STYLE_NULL,
    new SimpleLineSymbol(
      "solid",
      new Color("yellow"),
      2
    ),
    null
  );
  reloLayerFL.setSelectionSymbol(selectionSymbol);

  reloLayerFL.on("edits-complete", function() {
    reloLayer.refresh();
  });

  map.addLayers([reloLayerFL]);

  function initSelectToolbar(evt) {
    var reloLayerFL = evt.layers[0].layer;
    var selectQuery = new Query();

    map.on("click", function(evt) {
      selectQuery.geometry = evt.mapPoint;
      reloLayerFL.selectFeatures(selectQuery, FeatureLayer.SELECTION_NEW, function(features) {
        if (features.length > 0) {
         //store the current feature
          updateFeature = features[0];
          map.infoWindow.setTitle(features[0].getLayer().name);
          map.infoWindow.show(evt.screenPoint,map.getInfoWindowAnchor(evt.screenPoint));
        } else {
          map.infoWindow.hide();
        }
      });
    });

    map.infoWindow.on("hide", function() {
      reloLayerFL.clearSelection();
    });

    var props = {
      name: "numberTextBox",
      class: "atiField",
      constraints: {pattern: "#"}
    };
    var numTextBox = new dijit.form.NumberTextBox(props);

    var layerInfos = [{
      'featureLayer': reloLayerFL,
      'showAttachments': false,
      'isEditable': true,
      'showDeleteButton': false,
      'fieldInfos': [
        {'fieldName': 'Relo_Num', 'isEditable':true,'label':'Relo Number:', 'customField': numTextBox},
        {'fieldName': 'Sch_Name', 'isEditable':true,'label':'School:'},
        {'fieldName': 'Description', 'isEditable':true,'label':'Description:'},
        {'fieldName': 'Manufacturer', 'isEditable':false,'label':'Manufacturer:'},
        {'fieldName': 'Year_Built', 'isEditable':false,'label':'Year Built:'},
        {'fieldName': 'Size', 'isEditable':true,'label':'Size:'},
        {'fieldName': 'Sq_Feet', 'isEditable':false,'label':'Square Feet:'},
        {'fieldName': 'Notes', 'isEditable':true,'label':'Notes:', 'stringFieldOption': 'textarea'}
      ]
    }];

    var attInspector = new AttributeInspector({
      layerInfos:layerInfos
    }, domConstruct.create("div"));

    //add a save button next to the delete button
    var saveButton = new Button({ label: "Save", "class": "saveButton"});
    domConstruct.place(saveButton.domNode, attInspector.deleteBtn.domNode, "after");

    saveButton.on("click", function(){
      updateFeature.getLayer().applyEdits(null, [updateFeature], null);
      map.infoWindow.hide();
    });

    attInspector.on("attribute-change", function(evt) {
      //store the updates to apply when the save button is clicked
      updateFeature.attributes[evt.fieldName] = evt.fieldValue;
    });

    map.infoWindow.setContent(attInspector.domNode);
    map.infoWindow.resize(345, 350);
  }
});