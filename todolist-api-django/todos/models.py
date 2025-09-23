from django.db import models
from django.conf import settings

# Create your models here.
class Todo(models.Model):
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="todos"
    )
    title = models.CharField(max_length=255) #Tạo một cột text ngắn khoảng 255 kí tự
    description = models.TextField(blank=True) #Tạo một cột text dài, blank=True cho phép field bỏ trống ở cấp độ validation của Django
    is_completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True) #auto_now_add=True -> Django tự động set giá trị thời điểm lần đầu object được tạo
    updated_at = models.DateTimeField(auto_now=True) #auto_now=True -> Django tự động cập nhật thời điểm mỗi lần object được lưu

    class Meta:
        ordering = ["-created_at"]
    
    def __str__(self):
        return self.title