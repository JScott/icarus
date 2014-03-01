#pragma strict

private var timer = 0.0;
var growSpeed = 14.0;
var maxSize = 7.0;
var rotateSpeed = 150.0;
var radiusVariation = 4.0;
private var player : GameObject;
private var powerModifier = 1.0;
private var container : GameObject;

function Start () {
	player = GameObject.Find("Player");
}

function Update () {
	//timer = maxSize;
	var radius = 1 - 0.2*(Mathf.Abs(Mathf.Sin(Time.time*radiusVariation)));
	radius *= 3.5;	

	var size = maxSize;

	// Keep up with the player and an interesting rotation
	transform.position = player.transform.position;
	transform.position.y -= 1.0;
	transform.localScale = Vector3(radius,0.01,radius);
	transform.localRotation = Quaternion.Euler(0,rotateSpeed*Time.time,0);

	//particleEmitter.particles animation material.color.a = 0.5 - (0.5 * timer/size);
	particleEmitter.minEmission = timer * 50;
	particleEmitter.maxEmission = timer * 50;
	

	// Surround the player
	if (timer > 0.0)
		timer -= growSpeed * Time.deltaTime / 2.0;
		
	if (timer <= 0.0)
	{
		timer = 0.0;
		player.GetComponent(ThirdPersonController).StopPushing();
	}
}

function Grow() {
	timer += growSpeed*Time.deltaTime;
	timer = Mathf.Min(timer, maxSize);
}

function GetPower() {
	return timer/maxSize;
}

// power will be between 0-1
function Trigger(power:float) {
	powerModifier = power;
	timer += 0.01;
}