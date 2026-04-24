from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse


def wrath_of_olympus(request):
    return render(request, 'wrath_of_olympus/index.html')


def candy_slot_machine(request):
    
    return render(request, 'candy_soda/index.html')


def royal_masquerade(request):
    return render(request, 'royal_masquerade/index.html')