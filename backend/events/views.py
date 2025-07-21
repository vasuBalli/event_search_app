from django.shortcuts import render
import os, time
from rest_framework.views import APIView
from rest_framework.response import Response
from django.conf import settings

LOG_DIR = os.path.join(settings.BASE_DIR, "event_logs")

class EventSearchView(APIView):
    def post(self, request):
        search = request.data.get('search', '').strip()
        start_time = int(request.data.get('start_time', 0))
        end_time = int(request.data.get('end_time', 9999999999))

        results = []
        start_search = time.time()

        # Loop through log files
        for filename in os.listdir(LOG_DIR):
            print("printing the file name",filename)
            # if filename.endswith(".log"):
            print("if statement working")
            filepath = os.path.join(LOG_DIR, filename)
            with open(filepath, "r") as file:
                for line in file:
                    parts = line.strip().split()

                    # Ensure correct field count
                    if len(parts) < 15:
                        continue

                    try:
                        start = int(parts[11])
                        end = int(parts[12])
                    except ValueError:
                        continue

                    # Time filter
                    if start_time <= start <= end_time:
                        full_text = " ".join(parts)

                        # Match IP or field=value
                        if search in full_text or f"{search}" in full_text:
                            results.append({
                                "event": f"{parts[4]} → {parts[5]} | Action: {parts[13]} | Log Status: {parts[14]}",
                                "file": filename,
                            })

        end_search = time.time()

        return Response({
            "results": results,
            "search_time": round(end_search - start_search, 2)
        })
