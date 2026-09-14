# Dendrogram G6

Dendogram G6 is a frontend prototype for the visualisation and interaction with phylogenetic trees in the PHYLOViZ Web plataform, thst uses local mock services and does not require the backend service to run.

## Requirements

The first step is to install a Node.js, wich includes npm
In the present study it was used Node.js `v18.19.1` and npm `v9.2.0`.

## Next step is to do the Setup installation as following:

Open a terminal and run: 
```bash
git clone https://github.com/Catarina-Pereira/Dendrogram-G6.git
cd Dendrogram-G6
npm ci
npm start
```

## After the initial compilation finishes open:

http://localhost:4200


## Environment configuration:

The repository already includes the .env file required by the apllication

- INITIAL_VISIBLE_NODES -> The initial number of visible nodes
- MAX_VISIBLE_NODES -> The maximum number of visible nodes
- SUBTREE_THRESHOLD -> Subtree collapse treshold