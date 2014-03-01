#pragma strict

enum DetectorType {
	Wall = 0,
	Surface = 1,
}

var type : DetectorType;
private var player : GameObject;
private var hitting : boolean;
private var wall : GameObject;
private var surface : GameObject;

private var playerScript : ThirdPersonController;

function Start () {
	wall = GameObject.Find("Wall Collider");
	surface = GameObject.Find("Surface Collider");
	player = GameObject.Find("Player");
	
	playerScript = GameObject.Find("Player").GetComponent(ThirdPersonController);
}

function Update () {
	//Debug.Log(playerScript.canClimb);
	//Debug.Log(this.gameObject.name + ": " + hitting);
	if (IsSurfaceDetector())
	{
		transform.position = wall.transform.position;
		transform.position += transform.forward * 0.7;
		transform.position.y += 8;
	}
	
	if (IsWallDetector())
	{
		if (hitting)
		{
			// If surface not hitting already, then we know it's too high.
			var hit : RaycastHit;
			if (surface.rigidbody.SweepTest(-Vector3.up, hit, 7))
			{
				var cc :CapsuleCollider = surface.GetComponent(CapsuleCollider);
				surface.transform.position.y -= hit.distance;
				//Debug.Log("bottom: " + surface.collider.bounds.min.y + "; top: " + player.collider.bounds.max.y);
				if (surface.collider.bounds.min.y <= player.collider.bounds.max.y)
				{
					playerScript.canClimb = true;
				}
			}
			//renderer.material.color = Color.red;
		}
		else
		{
			playerScript.canClimb = false;
			renderer.material.color = Color.white;
		}
	}
}

function OnTriggerStay(c : Collider) {
	if (c.CompareTag("Geometry") && IsWallDetector())
	{
		hitting = true;
	}
}

function FixedUpdate() {
	hitting = false;
}

function IsWallDetector()
{
	return type == DetectorType.Wall;
}

function IsSurfaceDetector()
{
	return type == DetectorType.Surface;
}

function IsHitting()
{
	return hitting;
}

function CanClimb()
{
	
}