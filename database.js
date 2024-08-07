//importation mongoose
const mongoose = require('mongoose')

//importation dontev
require('dotenv').config();

//connection à la base de donnée
mongoose.connect(process.env.MONGO_URI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
})
.then(() => {
    console.log('Connexion à MongoDB réussie');
})
.catch((err) => {
    console.error('Erreur de connexion à MongoDB', err);
});

//schema prototype
var personneSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age : Number,
    favoriteFoods :[String]

});

//création du modèle
const Personne = mongoose.model('Personne', personneSchema);

//fonction pour créer document instance 

const creatandsaveperson =async() =>{
    try{
        const personne = new Personne({
        
            name: 'Jean Etienne',
            age: 50,
            favoriteFoods: ['Attiéké', 'Poulet']
        });

//enregistrer la personne par save()
    const data = await personne.save()
    console.log("Personne sauvegardée avec succès", data);
    }catch(err){
        console.error('Erreur lors de la sauvegarde',err)
    }
}



// Fonction pour créer plusieurs enregistrements
const createManyPeople = async (arrayOfPeople) => {
    try {
        const people = await Personne.create(arrayOfPeople);
        console.log("Personnes créées avec succès", people);
    } catch (err) {
        console.error("Erreur lors de la création", err);
    }
};


//utilisation find()pour cherché dans database
const findpeople = async (NomPersonne) =>{
    try{
        const pers = await Personne.find({name: NomPersonne})
        console.log('personne trouvée',pers);
    }catch(err){
        console.error("Erreur lors de la recxherche",err)
    }
};


//utilisation model.findone()
const findOnebyname =async (person) =>{
    try{
        const pers = await Personne.findOne({name :person});
        console.log('personne trouvée',pers);
    }catch(err){
        console.error("Erreur lors de la recxherche",err)
    }
}

//utilisation modl.findById()
const findByIDpers =async (personId) =>{
    try{
        const pers = await Personne.findById(personId);
        console.log('personne trouvée',pers);
    }catch(err){
        console.error("Erreur lors de la recxherche",err)
    }
}

//importation et création de ObjectId
const {ObjectId} =mongoose.Types

//Mise a jour en utilisant find edit save
const FindEditSave = async(personId) =>{
    try{
        const pers = await Personne.findById(personId);

        //ajout dans aliment préféré
        pers.favoriteFoods.push('Hamburger');

        //enregitrement
        const updatepers = await pers.save()
        console.log("Personne mise à jour", updatepers);
    }catch(err){
        console.error('Erreur lors de la mise a jour',err)
        }
}

//mise a jour en utilisant findOneAndUpdate
const FindOneAndUpdate = async(personeName) =>{
    try{
        const UpdatePerson = await Personne.findOneAndUpdate(
            {name:personeName},
            {age:20},
            {new:true} //retourne le document mise a jour
        )
        console.log("Personne mise à jour", UpdatePerson);
    }catch(err){
        console.error("Erreur lors de la mise à jour", err);
    }
}

// Pour supprimer un document FindByIdAndRemove
const FindOneAndDelete = async(personId) =>{
    try{
        if (!ObjectId.isValid(personId)) {
            throw new Error('ID invalide');
        }

        const deletePers = await Personne.findByIdAndDelete(personId);
        if (deletePers){
            console.log('Personne supprimée avec succès',deletePers);
        }else{
            console.log('aucun document trouvé')
        }

    }catch(err){
        console.error('Erreur lors de la suppression',err)
    }
}

//Supprimé en utilisant le nom 
const DeleteByName = async(name)=>{
    try{
        const result = await Personne.deleteMany({name:name})
        console.log('Documents supprimés:', result);
    }catch(err){
        console.error('Erreur lors de la suppression', err);
    }
}

//trouver des personne qui aime le burritos
const likeBuritos = async ()=>{
    try{
        const data = await Personne.find({favoriteFoods :'Burritos'})
        .sort({'name':1})
        .limit(2)
        .select('-age')
        .exec()

        console.log("Résultats de la requête en chaîne", data)
    }catch(err){
        console.log('error lors de la requete',err)
    }
}

creatandsaveperson()
// createManyPeople([{ name: 'John', age: 25, favoriteFoods: ['gateau'] }, { name: 'Mary', age: 22, favoriteFoods: ['riz'] }])
// findpeople('John');
// findOnebyname('Mary');
// findByIDpers(new ObjectId('66a3cfb6361deee5b5f77b9f'))
// FindEditSave('66a3cfb6361deee5b5f77b9f');
// FindOneAndUpdate('Jean Etienne');
// FindOneAndDelete(new ObjectId('66a3cfb6361deee5b5f77b9e'))
// DeleteByName('Mary')
// likeBuritos();
