// Upgrade NOTE: replaced 'SeperateSpecular' with 'SeparateSpecular'

/*Shader "Custom/Cheap Glass" {
	Properties {
		_MainTex ("Base (RGB)", 2D) = "white" {}
	}
	SubShader {
		Tags { "RenderType"="Opaque" }
		LOD 200
		
		CGPROGRAM
		#pragma surface surf Lambert

		sampler2D _MainTex;

		struct Input {
			float2 uv_MainTex;
		};

		void surf (Input IN, inout SurfaceOutput o) {
			half4 c = tex2D (_MainTex, IN.uv_MainTex);
			o.Albedo = c.rgb;
			o.Alpha = c.a;
		}
		ENDCG
	} 
	FallBack "Diffuse"
}
*/
/////////////////////////////////////////////////////// 

 

Shader "EnvMapGlass" { 

 

Properties { 

   _EnvMap ("EnvMap", 2D) = "black" { TexGen SphereMap } 

   } 

 

SubShader { 
   SeparateSpecular On
   Tags {"Queue" = "Transparent" }
      Pass { 
         Name "BASE" 

         ZWrite on 

         //Blend One One                       // additive

         Blend One OneMinusSrcColor          // soft additive

         //Blend SrcAlpha OneMinusSrcAlpha     // real alpha blending

         BindChannels { 

         Bind "Vertex", vertex 

         Bind "normal", normal 
      } 
      SetTexture [_EnvMap] { 
         combine texture 
      } 
   } 
} 
Fallback off 
}