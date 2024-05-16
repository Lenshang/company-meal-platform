FROM python:3.7

WORKDIR /app
ADD . /app

RUN pip install -i https://pypi.tuna.tsinghua.edu.cn/simple --no-cache-dir --upgrade -r /app/requirements.txt
CMD ["uvicorn", "run:create", "--host", "0.0.0.0", "--port", "80"]