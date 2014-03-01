#pragma strict
var upSpeed : float = 6.0;

// Start jumping if we enter from the ground
function OnTriggerEnter(collider : Collider) {
	var p : ThirdPersonController = GetPlayer(collider);
	if(p && p.IsGrounded()) {
		p.StartJumping();
		Debug.Log("Enter");
	}
}

// Push upward if we're not going fast enough
function OnTriggerStay(collider : Collider) {
	var p : ThirdPersonController = GetPlayer(collider);
	if(p && p.GetVerticalSpeed() <= upSpeed) {
		p.PushUp(upSpeed);
		Debug.Log("Stay");
	}
}

private function GetPlayer(collider : Collider) {
	var parent = collider.transform.parent.gameObject;
	var p : ThirdPersonController = parent.GetComponent(ThirdPersonController);
	if (p) {
		return p;
	}
	return null;
}