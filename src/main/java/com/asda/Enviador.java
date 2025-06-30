package com.asda;

import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;

import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;

import org.glassfish.jersey.media.multipart.FormDataParam;

import java.net.URL;

@jakarta.ws.rs.Path("/enviar")
public class Enviador {

    /**
     *
     * @param fileInputStream
     * @return
     * @throws IOException
     */
    @POST
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    public Response receberArquivo(@FormDataParam("arquivo") InputStream fileInputStream) throws IOException {

        // Salva o graph.gv temporariamente
        java.nio.file.Path tempPath = Files.createTempFile("graph", ".gv");
        Files.copy(fileInputStream, tempPath, StandardCopyOption.REPLACE_EXISTING);

        // Agora chama o container Python com um POST, como o Enviador.java faria
        HttpURLConnection conn = (HttpURLConnection) new URL("http://container_b:8000/processar").openConnection();
        conn.setDoOutput(true);
        conn.setRequestMethod("POST");
        // ... fazer multipart com tempPath ...

        // Lê resposta, salva arquivo recebido e devolve ao frontend
        return Response.ok("Arquivo processado").build();
    }
}
