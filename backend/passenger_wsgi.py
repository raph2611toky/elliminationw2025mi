import sys, os
sys.path.insert(0, '/home/ikomtoky/backend-ikom-webcup2025')
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
