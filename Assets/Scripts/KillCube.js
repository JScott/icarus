#pragma strict
var player : ThirdPersonController;

function Start () {
	renderer.enabled = false;
}

function Update () {

}

function OnTriggerEnter(other:Collider)
{
	if (player.jumpingReachedApex)
	{
		var AI : SilverfinAI = other.gameObject.GetComponent(SilverfinAI);
		if (AI)
		{
			AI.Die();
			player.StartBouncing();
		}
	}
}