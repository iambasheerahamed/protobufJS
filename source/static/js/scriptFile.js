var pb = {};
var message = {};

function onload() {

  /* protobuf is a global property.

  we can get this property using the belowed script on HTML file,

  <script src="https://cdn.jsdelivr.net/npm/protobufjs@6.11.2/dist/protobuf.js"></script>

  after getting the protobuf property, we can use the load method to generate the proto file to a Root property.

  That root property is an object, that will contains our generated proto model types inside.
  */

  protobuf.load("./proto/MyMessage.proto").then(function (root) {
    pb = root;

    prepareMsg();
  });
}

function verify() {

  if (verifyMessage(message)) {
    document.getElementById("text").innerText = JSON.stringify(convertToObject());
    alert("Verified SuccessFully..!")
  }
}

function convertToObject() {
  let msg = pb.lookupType("mypackage.MyMessage");

  /* toObject method for, our message format ro proto format..

  say for an exmaple.. In the message object, enumberation values assigned as 0,1,2;

  but in our proto file, we have mentioned as ENUM types.

  so using this toObject method, it will convert to our proto format as a datatype we mentioned below.
  */

  var object = msg.toObject(message, {
    enums: String,  // enums as string names
    longs: String,  // longs as strings (requires long.js)
    bytes: String,  // bytes as base64 encoded strings
    defaults: true, // includes default values
    arrays: true,   // populates empty arrays (repeated fields) even if defaults=false
    objects: true,  // populates empty objects (map fields) even if defaults=false
    oneofs: true    // includes virtual oneof fields set to the present field's name
  });

  return object
}


function prepareMsg() {

  /*
  pb is a property which is assigned above, which is ROOT object.

  mypackage is a package name, which is mentioned by us in myMessage.proto file.

  using this syntax, lookupType("mypackage.MyMessage")... we can get the myMessage Type.

  using the create() syntax, we can create a JS model.. which is assigned to message.

  */

  message = pb.lookupType("mypackage.MyMessage").create();
  prepareObject();
}

function prepareObject() {

  /*
  message is a JS model which is assigned above.
  From the message we can read/write the properties like normally.
  */

  message.key = "keyName"
  message.value = 100;

  /*
  NetworkCall is a message, in our protofile.

  Its also created as a model like message creation..
  using lookuptype with the respective package name and using create(0 syntax.

  here we have assigned 1 as status value.. That status value is a ENUM type in our proto.
  so we assigned the value from proto for ENUM. coz, in JS there is no enumeration cases available.

  Once created the network model, we have pushed the network model to MESSSGE network repeated type.
  [Repeated type is an array.]

  */

  let network = pb.lookupType("mypackage.NetworkCall").create()

  network.enabled = false;
  network.status = 1;

  message.network.push(network);
}

function verifyMessage(message) {

  /*
  Verify method.. It's available by defauly in protobuf.

  Here we have checked the message as the mentioned proto format.

  say for an exmaple..
  1) If we assigned a string value to a integer type.
  2) If we assigned a string to a enum value.. or assigned a wrong index to enum.

  This verify method will throw an error with respective message.
  */

  var myMsg = pb.lookupType("mypackage.MyMessage");
  var err = myMsg.verify(message);

  try {
    if (err) throw err;
  }
  catch(err) {
    alert(err);
  }
  return (err == null);
}

function sendEncodedMsgToServer() {
  const data = { action: "content" };

  fetch("/add", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((res) => console.log(res));

  showText(true);
}
