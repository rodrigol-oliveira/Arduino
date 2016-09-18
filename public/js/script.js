<script>
         function mostrar_opcao(obj) {

            document.getElementById('periodo').style.display="none";

            switch (obj.value) {
               case '1':
               document.getElementById('periodo').style.display="none";
               break

               case '2':
               document.getElementById('periodo').style.display="block";
               break
               
               case '3':
               document.getElementById('periodo').style.display="block";
               break
               
               case '4':
               document.getElementById('periodo').style.display="block";
               break
            }
         }
      </script>