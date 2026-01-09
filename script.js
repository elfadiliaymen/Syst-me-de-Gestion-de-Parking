function displayVehicles(){

 fetch('http://localhost:3000/vehicles').then(res => res.json()).then(data =>{

const tbody = document.getElementById("vehicles");
 tbody.innerHTML = "";

data.forEach(vehicle => {
     const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${vehicle.plateNumber}</td>
        <td>${vehicle.type}</td>
        <td>${new Date(vehicle.entryTime).toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit"
        })}</td>
        <td>${vehicle.slotNumber}</td>
        <td> </td>
      `;

      const btn = document.createElement("button");
        btn.textContent = "Sortir";
        btn.style.background = "#E74C3C";
        btn.style.color = "white";
        btn.style.border = "none";
        btn.style.padding = "6px 10px";
        btn.style.borderRadius = "6px";
        btn.style.cursor = "pointer";

        btn.addEventListener("click",() => sortir(vehicle.id));
        tr.lastElementChild.appendChild(btn);
    tbody.appendChild(tr);
});
} );
}



async function getFreePlace(){
 const res = await fetch("http://localhost:3000/parkingPlaces");
 const places = await res.json();
 const freePlace = places.find(p => !p.occupied);
return freePlace ? freePlace.id : null;
    };

async function getslotNumber(freePlaceID){

const res = await fetch(`http://localhost:3000/parkingPlaces/${freePlaceID}`)
const place = await res.json();
     return place.number;

    }

async function ajouter(){
   const imm = document.getElementById("imm").value;
const vtype = document.querySelector('input[name="vtype"]:checked')?.value;

    if(!imm || !vtype){
      alert("ajouter Véhicule");
      return;
    }

    const freePlaceID = await getFreePlace();

    if(freePlaceID == null){
      alert("Désolé, aucun emplacement libre !");
      return;
    }

    const slotnumber = await getslotNumber(freePlaceID);


    fetch("http://localhost:3000/vehicles", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(
       {
      "plateNumber": imm,
      "type": vtype,
      "entryTime": new Date().toISOString(),
      "exitTime": null,
      "slotNumber": slotnumber
    }
    ),
  }).then(res => res.json()).then(() => {
    return  fetch(`http://localhost:3000/parkingPlaces/${freePlaceID}` , {
        method : "PATCH",
        headers : {"Content-Type": "application/json"},
        body : JSON.stringify({occupied : true})

    }) }
  ).then(() => {
    alert("Véhicule ajouté !");
   displayVehicles();
   document.getElementById("formAjouter").reset();
  })

}


async function sortir(id){
    

   const resvehicles = await fetch(`http://localhost:3000/vehicles/${id}`);
   const vehicle = await resvehicles.json();

    const entryTime = new Date(vehicle.entryTime);
  const exitTime = new Date();


  const montant = calculerFrais(vehicle.entryTime, exitTime.toISOString());
  const dureeHeures = Math.ceil((exitTime - entryTime) / (1000 * 60 * 60));

  
  const confirmation = confirm(
    `TICKET DE STATIONNEMENT\n\n` +
    `Immatriculation : ${vehicle.plateNumber}\n` +
    `Type : ${vehicle.type}\n` +
    `Place : ${vehicle.slotNumber}\n` +
    `Heure d'entrée : ${entryTime.toLocaleTimeString("fr-FR")}\n` +
    `Heure de sortie : ${exitTime.toLocaleTimeString("fr-FR")}\n` +
    `Durée : ${dureeHeures} heure(s)\n` +
    `Montant à payer : ${Math.round(montant)} MAD\n\n` +
    `Confirmer la sortie du véhicule ?`
  );

  if (!confirmation) return; 

   const slotN = vehicle.slotNumber;
      
   const resplace = await fetch("http://localhost:3000/parkingPlaces");
   const places = await resplace.json();

   const place = places.find((p) => p.number == slotN);
   if(!place){
    return;
   }
   

   await fetch(`http://localhost:3000/parkingPlaces/${place.id}`, {
    method : "PATCH",
    headers : { "Content-Type": "application/json"},
    body : JSON.stringify({ occupied: false })
   });


   await fetch(`http://localhost:3000/vehicles/${id}` , {
    method : "DELETE"
   })

  displayVehicles();
  displayPlaces();
}


function displayPlaces(){
    const ul = document.querySelector(".placesul");
    const placeinfo = document.querySelector(".placeinfo");
    fetch("http://localhost:3000/parkingPlaces").then(res => res.json()).then(data => {
         const totaleplaces = data.length;
         let occupied = 0;
        data.forEach(place => {
   const li = document.createElement("li");
   li.textContent =  place.number;
   if(place.occupied == true){
     li.style.backgroundColor = "#5CB85C";
     occupied += 1;
   }else{
    li.style.backgroundColor = "#E8F0FE";
   }
   placeinfo.textContent = `${occupied} / ${totaleplaces} places occupées `
   ul.appendChild(li);
        } )

    })
}


function calculerFrais(entryTime, exitTime) {
  const start = new Date(entryTime);
  const end = new Date(exitTime);

  const diffMs = end - start;
  const diffHours = diffMs / (1000 * 60 * 60);

  let montant = 5;

  if (diffHours > 1) {
    montant = 5 + (diffHours - 1) * 3;
  }

  return montant;
}

displayVehicles();
displayPlaces();