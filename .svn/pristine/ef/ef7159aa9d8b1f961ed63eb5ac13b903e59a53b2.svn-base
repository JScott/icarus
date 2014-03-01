#pragma strict

var player:GameObject;

function Start () {

}

function Update () {
	var localPoint : Vector4 = transform.InverseTransformPoint(player.transform.position);
	localPoint.Scale(transform.localScale);
	localPoint.w = 1;
	renderer.material.SetVector("_BallPos", localPoint);
}
	/*var camera : Transform = Camera.main.transform;
    var cameraRelative : Vector3 = camera.InverseTransformPoint(player.transform.position);
    cameraRelative.Scale(camera.transform.localScale);
    var localPoint : Vector4 = Vector4(cameraRelative.x, cameraRelative.y, cameraRelative.z, 1);
    renderer.material.SetVector("_PlayerPos", localPoint);//player.transform.position);//localPoint);
*/