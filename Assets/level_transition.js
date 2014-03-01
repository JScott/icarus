#pragma strict
enum Level { 	A_MAIN = 0, 
				A_HOME = 1, 
				A_HORDE = 2 
			};
var goToLevel : Level;
var spawnIndex : int = -1;
static var lastLevel : Level;
private var player : Transform;
private var cam : ThirdPersonCamera;

function Awake() {
	player = GameObject.Find("Player").GetComponent(Transform);
	cam = GameObject.Find("Player").GetComponent(ThirdPersonCamera);
}

function OnTriggerEnter(other : Collider) {
	lastLevel = Application.loadedLevel;
	Application.LoadLevel(goToLevel);
	if (lastLevel == 0) lastLevel = Level.A_MAIN;
}

function OnLevelWasLoaded(level : int) {
	if (spawnIndex == -1) return;

	// Place player at selected spawn object
	player.position = GameObject.FindGameObjectsWithTag("Respawn")[spawnIndex].transform.position;
}