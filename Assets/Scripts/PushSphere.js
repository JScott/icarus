#pragma strict

private var timer = 0.0;
var growSpeed = 10.0;
var maxSize = 10.0;
var rotateSpeed = 10.0;
private var player : GameObject;
private var powerModifier = 1.0;

function Start () {
	player = GameObject.Find("Player");
}

function Update () {
	//var size = maxSize * Mathf.Max(0.6, Mathf.Log10(2+powerModifier*20));
	//var rot = rotateSpeed * Time.deltaTime * (3.1*powerModifier);
	var size = maxSize;
	var rot = rotateSpeed * Time.deltaTime;	

	// Keep up with the player and an interesting rotation
	transform.position = player.transform.position;
	transform.position.y -= 1.0;
	transform.localScale = Vector3(timer,timer/1.6,timer);
	transform.Rotate(0, rot, 0);
	renderer.material.color.a = 0.6 - (0.6 * timer/size);
	
	// Explode outward!
	if (timer > 0.0)
		timer += growSpeed * Time.deltaTime;
		
	if (timer > size/2.0)
		player.GetComponent(ThirdPersonController).StopPushing();
	
	if (timer > size)
		timer = 0.0;
}

// power will be between 0-1
function Trigger(power:float) {
	powerModifier = power;
	timer += 0.01;
}