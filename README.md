# sillycat-pm2-api
Provide the RESTful API for pm2

### NodeJS Application
```
sudo ln -s /home/centos/work/sillycat-pm2-api /opt/sillycat-pm2-api
cd /opt/sillycat-pm2-api
npm install
sudo ln -s /home/centos/.nodenv/shims/pm2 /opt/pm2
PORT=8027 node app.js 
```

### create a pm2 process
```
curl -X POST http://localhost:8027/api/v1/applications -H "Content-Type: application/json" -d '{ "script": "/opt/celery", "name": "celery-worker", "args": "/opt/celery -A celery_task_ai worker --loglevel=DEBUG --hostname=worker-$(hostname)-$$", "instances": 2, "cwd": "/opt/sillycat-celery"}'
```

### fetch the list
```
curl -X GET http://localhost:8027/api/v1/applications
```

### stop a process
```
curl -X POST http://localhost:8027/api/v1/applications/stop -H "Content-Type: application/json" -d '{ "name": "celery-worker" }'
```

### restart a process
```
curl -X POST http://localhost:8027/api/v1/applications/restart -H "Content-Type: application/json" -d '{ "name": "celery-worker" }'
```

### delete a process
```
curl -X POST http://localhost:8027/api/v1/applications/delete -H "Content-Type: application/json" -d '{ "name": "celery-worker" }'
```

### scale a process
```
curl -X POST http://localhost:8027/api/v1/applications/scale -H "Content-Type: application/json" -d '{ "name": "celery-worker", "instances": 4 }'
```