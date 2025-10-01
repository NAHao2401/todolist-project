from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Todo

class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True) #write_only: Chỉ cho phép ghi(Khi gửi request) chứ không bao giờ được gửi về trong response

    class Meta:
        model = User
        fields = ["username", "password", "email"]

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data.get("email"),
            password=validated_data["password"]
        )
        return user

class TodoSerializer(serializers.ModelSerializer):#ModelSerializer = serializer đặc biệt của DRF, tự động map fields từ model sang JSON
    owner = serializers.ReadOnlyField(source="owner.username")

    class Meta:
        model = Todo
        fields = ["id", "title", "description", "is_completed",
                  "created_at", "updated_at", "owner"]
        read_only_fields = ["id", "created_at", "updated_at", "owner"]

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, min_length=6)

    def validate_old_password(self, value):
        user = self.context["request"].user
        if not user.check_password(value):
            raise serializers.ValidationError("Mật khẩu cũ không đúng")
        return value
    
    def validate_new_password(self, value):
        # Bạn có thể thêm quy tắc mạnh hơn (chữ hoa, số, ký tự đặc biệt)
        if len(value) < 6:
            raise serializers.ValidationError("Mật khẩu mới quá ngắn (tối thiểu 6 ký tự).")
        return value

    def save(self, **kwargs):
        user = self.context["request"].user
        new_password = self.validated_data["new_password"]
        user.set_password(new_password)
        user.save()
        return user