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
ssh root@172.16.10.102

docker rm -f $(docker ps -aq)
docker rmi $(docker images -aq)

docker exec 2b bash -c "kill -15 \$(ps | grep 'java -jar' | awk '{print \$1}')"
find /root/.microemulator/ -mindepth 1 ! -name 'config2.xml' -exec rm -rf {} +

https://www.digitalocean.com/community/tutorials/how-to-set-up-ssh-keys-on-ubuntu-20-04
cat ~/.ssh/id_rsa_gitpod.pub | ssh root@14.225.255.89 "mkdir -p ~/.ssh && touch ~/.ssh/authorized_keys && chmod -R go= ~/.ssh && cat >> ~/.ssh/authorized_keys"
sudo nano /etc/ssh/sshd_config
PasswordAuthentication no
sudo systemctl restart ssh

sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22
sudo ufw enable

// my ip
118.68.84.249
sudo ufw allow from 118.68.84.249 to any port 2376
sudo ufw delete from 118.68.84.249 to any port 2376

// srv1
ssh root@14.225.255.89

docker image prune -f

echo "nameserver 8.8.8.8" >> /etc/resolv.conf

e2JJ#NybyEk@P^K!

e2JJ#NybyEk@P^K!121

keep


virsh
/etc/libvirt/qemu/networks
virsh net-start wlxd03745825bc0

virsh net-edit default

sudo ip route add default via 192.168.150.10 dev eth1 metric 1

sudo ip route add default via 192.168.150.10 dev virbr1 metric 1
sudo ip route delete default via 192.168.150.10 dev virbr1 metric 1

sudo ip route add default via 192.168.1.1 dev wlxd03745d1164c proto dhcp metric 618 
sudo ip route add default via 192.168.1.1 dev wlxd03745825bc0 proto dhcp metric 620

sudo ip route delete default via 192.168.1.1 dev wlxd03745d1164c proto dhcp metric 618 
sudo ip route delete default via 192.168.1.1 dev wlxd03745825bc0 proto dhcp metric 620

keep