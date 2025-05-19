from django.shortcuts import render, redirect
from django.contrib.auth import logout
from django.views.decorators.http import require_http_methods

@require_http_methods(["GET", "POST"])
def logout_view(request):
    if request.method == "POST":
        logout(request)
        return redirect('admin:login')
    print("logout view")
    return render(request, "admin/logout.html")