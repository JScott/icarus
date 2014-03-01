#pragma strict

var text:String = "I AM ERROR";
var type:InteractType;
var interactDistance:float = 7.0;
private var highlightObj:GameObject;
var highlightObjectHeight = 2.0;

var guiGrowSpeed = 1.3;
private var guiExpandTimer = 0.0;
var chatTex:Texture2D;
private var guiScale:Vector3;
private var style:GUIStyle;

private var facing : Vector3; // Where we look normally
private var engagedFacing : Vector3; // Where we look when talking
private var actualFacing : Vector3; // Smoothing between the two
private var engaged = false;

private var screenHeight = 1080.0;
private var screenWidth = 1650.0;

enum InteractType {
	Talk = 0,
	Pickup = 1,
}

function OnGUI() {
	guiScale = new Vector3(Screen.width / screenWidth,//99.0,
							Screen.height / screenHeight,//99.0,
							1.0);
	GUI.matrix = Matrix4x4.Scale(guiScale);
	if(!chatTex){
    	Debug.LogError("Assign a Texture in the inspector.");
    	return;
    }
    var swu = screenWidth / 100.0; //screen width unit
    var shu = screenHeight / 100.0; //screen height unity
    var left = swu * (10 - 1);
    var top = shu * (75 - 1);
    var width = swu * (80 + 2) * guiExpandTimer;
    var height = shu * (20 + 2) * guiExpandTimer;
    GUI.DrawTexture(Rect(left, top, width, height), chatTex, ScaleMode.StretchToFill, true, 1.0);
	if (ShouldDrawText()) {
		GUI.Label(Rect(left + swu, 
						top + shu, 
						width - (2*swu), 
						height - (2*shu)), 
						text, 
						style);
	}
}

function Start () {
	facing = actualFacing = transform.forward;
	
	text = text.Replace("%n", "\n");

	style = GUIStyle();
	style.fontSize = screenHeight * 0.09;

	chatTex = new Texture2D(1,1,TextureFormat.ARGB32, false);
	chatTex.SetPixel(0,0,Color.white);
	chatTex.Apply();
	
	highlightObj = GameObject.CreatePrimitive(PrimitiveType.Sphere);
	highlightObj.transform.position = transform.position;
	highlightObj.transform.position.y += highlightObjectHeight;
	highlightObj.renderer.material.color = Color.yellow;
}

function Update () {
	highlightObj.renderer.enabled = false;
	if (guiExpandTimer > 0.0 && guiExpandTimer < 1.0) {
		guiExpandTimer += guiGrowSpeed * Time.deltaTime;
		if (guiExpandTimer > 1.0) guiExpandTimer = 1.0;
	}
	
	// Deal with rotation
	var targetFacing = engaged ? engagedFacing : facing;
	actualFacing = Vector3.Lerp(actualFacing, targetFacing, 0.05);
	transform.LookAt(transform.position + actualFacing);
}

function Highlight() {
	highlightObj.renderer.enabled = true;
}

function Interact(withme : Vector3) {
	engagedFacing = withme - transform.position;
	engagedFacing.Normalize();
	
	switch(type) {
		case 0:
			if (guiExpandTimer == 0)
			{
				engaged = true;
				guiExpandTimer += 0.01;
			}
			else
			{
				engaged = false;
				guiExpandTimer = 0.0;
			}
			break;
		case 1:
			Debug.Log("pick up");
			break;
		default:
			break;
	}
}

function ShouldDrawText() {
	return (guiExpandTimer == 1.0);
}