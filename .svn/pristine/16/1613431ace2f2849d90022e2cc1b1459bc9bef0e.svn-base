// Upgrade NOTE: replaced 'glstate.matrix.mvp' with 'UNITY_MATRIX_MVP'

Shader "PinballShaders/BoundaryGlowShader"
{
    Properties 
    {
        _Color ("Main Color", Color) = (0.1, 0.3, 0.7, 0.25)
        _BallPos("Pinball position", Vector) = (0,0,0,1)
        //Max dist indicates the size of the effect when 
        //pinball comes near the wall
        _MaxDist("Maximum distance", Float) = 2.0
        _MainTex ("Base (RGBA)", 2D) = "white" {}
    }
    SubShader 
    {
        //Blend One One 
        Blend SrcAlpha OneMinusSrcAlpha

        Tags {Queue = Transparent}
        Cull Off

        Pass
        {
CGPROGRAM
#pragma vertex vert
#pragma fragment frag
#include "UnityCG.cginc"

uniform float4 _Color;
uniform float4 _BallPos;
uniform float _MaxDist;
uniform sampler2D _MainTex;

struct v2f {
    float4 pos : POSITION;
    float4 color : COLOR0;
    float4 fragPos : COLOR1;
    float2 uv : TEXCOORD0;
};

struct Input {
	float2 uv_MainTex;
};

v2f vert (appdata_base v)
{
    v2f o;
    // Check distance here.

    float dist = distance(_BallPos, v.vertex);
    float safety = step(0.001 , _MaxDist);
    o.color = _Color;
    o.color.a = safety *  (1 - clamp(dist, 0, _MaxDist)/_MaxDist);
    	o.color.a = max(o.color.a, 0.05);
    o.pos = mul (UNITY_MATRIX_MVP, v.vertex);
    //Store the fragment position relative to eye coordinate system.
    //Is this interpolated between vertex and fragment shader?
    o.fragPos = o.pos;
    
    //TODO: o.uv = TRANSFORM_TEX(v.texcoord, _MainTex);
    return o;
}

half4 frag (v2f i) : COLOR
{
    float4 outColor = i.color; //TODO: tex2D(_MainTex, i.uv);
    return outColor;
}
ENDCG

        }
    } 
    FallBack "VertexLit"
}