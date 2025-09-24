#ModelViewSet: Cung cấp sẵn các hành động CRUD
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from .models import Todo
from .serializers import TodoSerializer, UserRegisterSerializer

#Register
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

# Create your views here.
class TodoViewSet(ModelViewSet):

    #Quy định dùng serializer: Todoserializer để xử lý dữ liệu vào/ra
    serializer_class = TodoSerializer 
    #IsAuthenticated: Chỉ cho phép người dùng đã đăng nhập mới được truy cập API
    permission_classes = [IsAuthenticated]
    #Cho phép lộc Todo theo trạng thái hoàn thành (is_completed=true/false)
    filterset_fields = {"is_completed": ["exact"]}
    #Cho phép tìm kiếm Todo theo tiêu đề hoặc mô tả. 
    search_fields = ["title", "description"]
    #Cho phép sắp xếp kết quả theo các fields
    ordering_fields = ["created_at", "updated_at", "title", "is_completed"]

    #Mỗi người dùng chỉ thấy đươc các công việc(Todo) của chính họ
    def get_queryset(self):
        return Todo.objects.filter(owner=self.request.user)
    
    #Khi user tạo một Todo mới, owner sẽ được gán tự động là user hiện tại
    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
    
class RegisterView(APIView):
    permission_classes=[] #Bất kì ai cũng có thể gọi

    def post(self, request):
        serializer = UserRegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Đăng ký thành công!"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)