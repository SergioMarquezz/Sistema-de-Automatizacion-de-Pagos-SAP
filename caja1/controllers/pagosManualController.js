  
var matricula = $("#myInputAlumnos");
var fertilizer = $("#costo-unitario"); //Variable para generar la referencia
var fertilizer_bd = $("#costo-letra"); //Variable que se guarda en base de datos
var concept = $("#clave_concepto");
var total_amount = $("#monto-total");
var cantidad = $("#quantity");

$(document).ready(function () {
    
    studentsRegular();
    searchStudentsData();
    savePaymentsManual();
    paymentTotal();

    $("#hide").hide();
    $("#hide2").hide();
    $("#hide3").hide();
    $("#quantity").attr('readonly', true);
});

function studentsRegular(){

    $.ajax({
        type: "POST",
        url: "../models/pagosManualModel.php",
        data: {
            "options": "students"
        },
        dataType: "json",
        success: function (response) {
        

            var rows = response.students.length;
          
            for(row = 0; row < rows; row++){

              var tbody_students = "<tr><td>"+response.students[row].matricula+"</td>"+
                                        "<td>"+response.students[row].nombre+"</td>"+
                                        "<td>"+response.students[row].apellido_pat+"</td>"+
                                        "<td>"+response.students[row].apellido_mat+"</td>"+
                                        "<td>"+response.students[row].carrera+"</td>"+
                                        "<td>"+response.students[row].grado_actual+"</td>"+
                                    "</tr>"

                $("#tbodyAlumnos").append(tbody_students);
            }
        }
    });
}

function savePaymentsManual(){

    $("#btn-pagar").click(function (e) { 
        e.preventDefault();
      
        var textoAlerta = "El pago que estas realizando quedara guardado con los datos correspondientes";
        var key_people;
        var matri = matricula.val();
        var ferti = fertilizer.val();
        var ferti_bd = fertilizer_bd.val();
        var key_concept = concept.val();
        var abono = total_amount.val();
        var quantity = cantidad.val();
  

        //Ajax para la clave de persona
        $.ajax({
            type: "POST",
            url: "../models/pagosManualModel.php",
            data: {
                "options": "enrollments",
                "enrollment": matri
            },
            
            success: function (response) {
                console.log(response);
                var json = JSON.parse(response);
                key_people = json.key_student; 
            }
        });

        swal({
            title: "¿Estás seguro?",   
            text: textoAlerta,   
            type: "question",   
            showCancelButton: true,     
            confirmButtonText: "Aceptar",
            cancelButtonText: "Cancelar",
            allowOutsideClick: false
        }).then(function(){

            if(key_concept == ""){

                swal({
                    title: "Error al guardar",   
                    text: "No has indicado el concepto que se quiere pagar, por favor selecciona alguno",   
                    type: "error",      
                    confirmButtonText: "Aceptar",
                    allowOutsideClick: false
                })
            }
            else if(quantity == ""){
                swal({
                    title: "Error al guardar",   
                    text: "No has indicado la cantidad a pagar",   
                    type: "error",      
                    confirmButtonText: "Aceptar",
                    allowOutsideClick: false
                })
            }
            else{
                   //Ajax para guardar el pago
                $.ajax({
                    type: "POST",
                    url: "../models/pagosManualModel.php",
                    data: {
                        "options": "payment-manual",
                        "matricula": matri,
                        "key_people": key_people,
                        "fertilizer": ferti,
                        "fertilizer_bd": ferti_bd,
                        "key_concept": key_concept,
                        "abonos": abono,
                        "quantity": quantity

                    },
                    success: function (response) {
                        console.log(response);
                        if(response == "save payment"){
                        
                            swal({
                                title: "Proceso Satisfactorio",   
                                text: "El pago se realizo correctamente",   
                                type: "success",   
                                confirmButtonText: "Aceptar",
                                allowOutsideClick: false
                            }).then(function(){

                                location.reload();
                            })
                        }
                    }
                });
            }
        });

    });
}

//Funcion para busqueda de datos
function searchStudentsData(){

    $("#myInputAlumnos").keyup(function(){

        _this = this;

        $.each($("#myTableAlumnos tbody tr"), function() {
            
            if($(this).text().toLowerCase().indexOf($(_this).val().toLowerCase()) === -1){
                
                $(this).hide();
            }
            else{
                $(this).show();

                $("#hide").show();
                $("#hide2").show();
                $("#hide3").show();
            }
            
        });
    });
  }

  //Funcion para sacar el total del pago
  function paymentTotal(){

    $("#quantity").keyup(function (e) { 


        var letter_cost = fertilizer_bd.val();
        var quantity = $(this).val();

        var total_cost = letter_cost * quantity;

        total_amount.val(total_cost);

        $.ajax({
            type: "POST",
            url: "../views/includes/num_letra.php",
            data: {
                "numero": total_cost
            },
            success: function (data) {
                console.log(data);
                
                var str = data + " Pesos 00/100 M.N.";
                var res = str.toUpperCase();
                $("#total").val("$ "+total_cost + " ("+res+")");
            }
        });

    });
  }