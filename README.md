openssl genrsa -out ca-key.pem 2048
openssl req -x509 -sha256 -new -nodes -key ca-key.pem -days 3650 -out ca.pem

openssl genrsa -out client-key.pem 2048
openssl req -subj '/CN=client' -new -key client-key.pem -out client.csr
echo subjectAltName = DNS:j2.master,IP:172.16.10.100 > extfile.cnf
echo extendedKeyUsage = serverAuth >> extfile.cnf
openssl x509 -req -days 3650 -sha256 -in client.csr -CA ca.pem -CAkey ca-key.pem -CAcreateserial -out client-cert.pem -extfile extfile.cnf

docker swarm  init --advertise-addr eth1
docker swarm ca --ca-cert /keys/ca.pem --ca-key /keys/ca-key.pem --rotate
docker swarm join --token SWMTKN-1-0vf8dgmp7iwwit57sk8pclhv7xlc15gf4f4edhoh26lyh98egb-0a7274fenyvv4d11xwieapefa 172.16.10.100:2377

[Title](https://stackoverflow.com/questions/52244214/installing-ssl-cert-in-docker-swarm)
[Title](https://docs.docker.com/config/daemon/)
[Title](https://stackoverflow.com/questions/44052054/unable-to-start-docker-after-configuring-hosts-in-daemon-json)

nano /usr/lib/systemd/system/docker.service
-H tcp://0.0.0.0:2376 -H unix:///var/run/docker.sock
systemctl daemon-reload
systemctl restart docker

/usr/lib/systemd/system/

https://www.thegeekdiary.com/how-to-remove-virbr0-and-lxcbr0-interfaces-on-centos-rhel-5-and-rhel-7/
sudo ip link set virbr1 down
sudo brctl delbr virbr1
sudo ip link set virbr2 down
sudo brctl delbr virbr2

sudo service libvirtd stop
sudo service libvirtd start

ssh root@172.16.10.100
ssh root@172.16.10.101

docker rm -f $(docker ps -aq)
docker rmi $(docker images -aq)

docker exec 2b bash -c "kill -15 \$(ps | grep 'java -jar' | awk '{print \$1}')"