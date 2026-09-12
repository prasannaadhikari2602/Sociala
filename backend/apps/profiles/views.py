from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Profile, Interest
from .serializers import (
    ProfileSerializer,
    ProfileSetupSerializer,
    ProfileUpdateSerializer,
    InterestSerializer,
)


class MyProfileView(APIView):
    """
    GET   /api/profiles/me/   -> always returns { is_setup: bool, profile: {...} or null }
    PATCH /api/profiles/me/   -> edit existing profile (only if already setup)
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        profile = Profile.objects.filter(user=request.user, is_setup=True).first()

        if not profile:
            return Response(
                {
                    "is_setup": False,
                    "profile": None,
                },
                status=status.HTTP_200_OK,
            )

        serializer = ProfileSerializer(profile, context={"request": request})
        return Response(
            {
                "is_setup": True,
                "profile": serializer.data,
            },
            status=status.HTTP_200_OK,
        )

    def patch(self, request):
        profile = Profile.objects.filter(user=request.user, is_setup=True).first()
        if not profile:
            return Response(
                {"detail": "Profile not set up yet.", "is_setup": False},
                status=status.HTTP_400_BAD_REQUEST,
            )
        serializer = ProfileUpdateSerializer(
            profile, data=request.data, partial=True, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            {
                "is_setup": True,
                "profile": ProfileSerializer(profile, context={"request": request}).data,
            }
        )


class ProfileSetupView(APIView):
    """
    POST /api/profiles/setup/  -> first-time profile creation
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        existing = Profile.objects.filter(user=request.user, is_setup=True).first()
        if existing:
            return Response(
                {"detail": "Profile already set up.", "is_setup": True},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = ProfileSetupSerializer(
            data=request.data, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        profile = serializer.save()

        return Response(
            {
                "is_setup": True,
                "profile": ProfileSerializer(profile, context={"request": request}).data,
            },
            status=status.HTTP_201_CREATED,
        )


class ProfileDetailView(generics.RetrieveAPIView):
    """
    GET /api/profiles/<user_id>/ -> public view of any user's profile
    """
    queryset = (
        Profile.objects.filter(is_setup=True)
        .select_related("user")
        .prefetch_related("interests")
    )
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    lookup_field = "user_id"
    lookup_url_kwarg = "user_id"


class ProfileListView(generics.ListAPIView):
    """
    GET /api/profiles/ -> list all set-up profiles
    """
    queryset = (
        Profile.objects.filter(is_setup=True)
        .select_related("user")
        .prefetch_related("interests")
    )
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class InterestListCreateView(generics.ListCreateAPIView):
    queryset = Interest.objects.all()
    serializer_class = InterestSerializer

    def get_permissions(self):
        if self.request.method == "POST":
            return [permissions.IsAdminUser()]
        return [permissions.IsAuthenticatedOrReadOnly()]