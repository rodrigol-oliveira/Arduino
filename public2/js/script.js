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


<script>
function mostrar_abas(obj) {

   <% for(i=0; i < jardim.length; i++) { %>
      document.getElementById('div_aba<%=i%>').style.display="none";
      <%}%>
      switch (obj.id) {
         <% for(i=0; i < jardim.length; i++) { %>
            case 'mostra_aba<%=i%>':
            document.getElementById('div_aba<%=i%>').style.display="block";
            break
            <%}%>
         }
      }
      </script>


      