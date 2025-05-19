from gradio_client import Client

client = Client("http://127.0.0.1:7860")

def animate(image_path, audio_path):
    try:
        print(client.api_prefix)
        result = client.predict(
            image_path,
            audio_path,
            "full",
            False,
            False,
            2,
            256,
            0,
            fn_index=0
        )
        return result
    except Exception as e:
        import traceback
        traceback.print_exc()

