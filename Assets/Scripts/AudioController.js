#pragma strict

private var playerScript : ThirdPersonController;

var mainCamera : Camera;

var hoverWind : AudioClip;
var doubleJumpWind : AudioClip;

var volumeFadeRate = 2.0;

private var audioHoverWind : AudioSource;
private var audioDoubleJumpWind : AudioSource;

function AddAudio(clip:AudioClip, loop:boolean, playAwake:boolean, vol:float):AudioSource
{
	var newAudio = gameObject.AddComponent(AudioSource);
	newAudio.clip = clip;
	newAudio.loop = loop;
	newAudio.playOnAwake = playAwake;
	newAudio.volume = vol;
	newAudio.bypassEffects = true;
	newAudio.panLevel = 0;
	return newAudio;
}

function Awake() {
	playerScript = GameObject.Find("Player").GetComponent(ThirdPersonController);
	
	audioHoverWind = 		AddAudio(hoverWind, true, false, 1.0);
	audioDoubleJumpWind = 	AddAudio(doubleJumpWind, false, false, 1.0);
}

function Update () {
	var hovering = playerScript.IsHovering();
	//var djumping = playerScript.IsDoubleJumping();
	//var pushing = playerScript.IsPushing();
	
	PlaySound(audioHoverWind, hovering, true);
	//PlaySound(audioDoubleJumpWind, djumping, false);
	//PlaySound(audioHoverWind, pushing, true);
}

function PlaySound(audioSource:AudioSource, condition:boolean, fade:boolean)
{
	if (condition && !audioSource.isPlaying) {
		if (fade) audioSource.volume = 1.0;
		audioSource.Play();
	} else if (!condition && audioSource.isPlaying) {
		if (fade) {
			audioSource.volume -= volumeFadeRate * Time.deltaTime;
			if (audioSource.volume <= 0)
				audioSource.Stop();
		}
		else {
			audioSource.Stop();
		}
	}
}