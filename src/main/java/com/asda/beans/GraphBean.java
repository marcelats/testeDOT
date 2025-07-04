package com.asda.beans;

import java.io.*;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.NamedQueries;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import org.hibernate.validator.constraints.NotEmpty;

/**
 * GraphBean bean.
 *
 * @author Felipe Osorio Thomé
 */
@Entity
@Table(name = "graphs",
        uniqueConstraints= @UniqueConstraint(columnNames={"user_id", "graph_name"}))
@NamedQueries({
    @NamedQuery(name="graphs.findGraph",
               query="SELECT g FROM GraphBean g WHERE g.graphName = :name AND (g.user = :user OR g.publicGraph=true)"),
    @NamedQuery(name="graphs.findGraphs",
               query="SELECT g FROM GraphBean g WHERE g.user = :user OR g.publicGraph = true"),
    @NamedQuery(name="graphs.setPublic",
               query="UPDATE GraphBean g SET g.publicGraph = true WHERE g.graphName = :name"),
    @NamedQuery(name="graphs.setPrivate",
               query="UPDATE GraphBean g SET g.publicGraph = false WHERE g.graphName = :name"),
    @NamedQuery(name="graphs.deleteGraph",
               query="DELETE FROM GraphBean WHERE graphName = :name"),
    @NamedQuery(name="graphs.renameGraph",
               query="UPDATE GraphBean g SET graphName = :newName WHERE graphName = :name"),
}) 
public class GraphBean implements Serializable {

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Column(name = "graph_id")
    private Long graphId;
    
    @ManyToOne(optional=false)
    @JoinColumn(name="user_id", nullable=false)
    private AccountBean user;
    
    @Column(name = "graph_name")
    @NotEmpty
    private String graphName;
    
    /* @Lob does not work here (hibernate bug).
     * Attention: this solution is not portable.
     */
    @Column(name = "graph_json", columnDefinition="TEXT")
    @NotEmpty
    private String graphJson;
    
    @Column(name = "publicGraph")
    private boolean publicGraph;

    public GraphBean() {
    }

    public Long getGraphId() {
        return graphId;
    }

    public void setGraphId(Long graphId) {
        this.graphId = graphId;
    }

    public AccountBean getUser() {
        return user;
    }

    public void setUser(AccountBean user) {
        this.user = user;
    }

    public String getGraphName() {
        return graphName;
    }

    public void setGraphName(String graphName) {
        this.graphName = graphName;
    }

    public String getGraphJson() {
        return graphJson;
    }

    public void setGraphJson(String graphJson) {
        this.graphJson = graphJson;
    }
    
    public boolean getPublicGraph() {
        return publicGraph;
    }

    public void setPublicGraph(boolean publicGraph) {
        this.publicGraph = publicGraph;
    }
}
