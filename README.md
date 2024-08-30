
<h1 align="center">
  PrivateGPT_UI
  <br>
</h1>

<h4 align="center">New student assignment - GPT2 UI Website from scratch</a> </h4>

<p align="center">
<a href=""><img src="https://img.shields.io/github/stars/namphuongtran9196/privategpt_ui?" alt="stars"></a>
<a href=""><img src="https://img.shields.io/github/forks/namphuongtran9196/privategpt_ui?" alt="forks"></a>
<a href=""><img src="https://img.shields.io/github/license/namphuongtran9196/privategpt_ui?" alt="license"></a>
</p>

<p align="center">
  <a href="#how-to-use">How To Use</a> •
  <a href="#references">References</a> •
</p>

## How To Use
- Requirements
```
python >= 3.10
django >= 5.1
```
- Clone this repository 
```bash
git clone https://github.com/tpnam0901/PrivateGPT_UI.git
cd PrivateGPT_UI
```
- Create a conda environment and install requirements
```bash
conda env create --name py3.10 python==3.10.* -y
conda activate py3.10
pip install -r requirements.txt
```

- Run server
```bash
cd webserver
python manager.py makemigrations
python manager.py migrate
python manager.py runserver
```

## References

---

> GitHub [@tpnam0901](https://github.com/tpnam0901) &nbsp;&middot;&nbsp;
