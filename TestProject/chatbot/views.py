from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from google import genai
import json

# Create your views here.

def index(request):
    return render(request, 'chatbot/index.html')

def get_gemini_response(message):
    """Helper function to get response from Gemini API"""
    try:
        client = genai.Client(api_key=settings.GEMINI_API_KEY)
        response = client.models.generate_content(
            model="gemini-flash-latest",
            contents=message
        )
        return response.text
    except Exception as e:
        return f"Sorry, I encountered an error: {str(e)}"

@csrf_exempt
def chat_api(request):
    """API endpoint for chat messages"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            user_message = data.get('message', '')

            if not user_message:
                return JsonResponse({'error': 'No message provided'}, status=400)

            # Get response from Gemini
            bot_response = get_gemini_response(user_message)

            return JsonResponse({
                'user_message': user_message,
                'bot_response': bot_response
            })

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Method not allowed'}, status=405)



