from rest_framework import serializers
from .models import Todo

class TodoSerializer(serializers.ModelSerializer):#ModelSerializer = serializer đặc biệt của DRF, tự động map fields từ model sang JSON
    owner = serializers.ReadOnlyField(source="owner.username")

    class Meta:
        model = Todo
        fields = ["id", "title", "description", "is_completed",
                  "created_at", "updated_at", "owner"]
        read_only_fields = ["id", "created_at", "updated_at", "owner"]