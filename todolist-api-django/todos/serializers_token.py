from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Thêm custom claims
        token["username"] = user.username
        token["email"] = user.email
        return token

    # def validate(self, attrs):
    #     data = super().validate(attrs)
    #     # Thêm username và email vào response trả về luôn
    #     data["username"] = self.user.username
    #     data["email"] = self.user.email
    #     return data
