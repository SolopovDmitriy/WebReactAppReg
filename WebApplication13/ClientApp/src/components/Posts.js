import React, { Component } from 'react';
import { render } from 'react-dom';

export class Posts extends Component {

    constructor(props) {
        super(props);
        this.state = {
            allPosts: [],                   //все посты полученные от сервера
            categories: [],                 //уникальные категории - поулчаем из выборки массива allPosts
            filteredPosts:[],               //посты с учетом фильтра
            loading: true
        };
    }
    componentDidMount() {
        this.populatePostsData();
    }
    handleChangeCategories = (event) => {
        console.log(this.state)
        let catId = event.target.value;
        var filterPosts = [];
        if (catId == 0) {       //опять показать все посты
            this.setState({ filteredPosts: this.state.allPosts });
        } else {
            console.log('categories changed')

            /*перебрать все посты*/
            this.state.allPosts.forEach((post, index) => {
                if (post.categoryId == catId) {
                    filterPosts.push(post);
                }
            });
            this.setState({ filteredPosts: filterPosts });
        }
    }
    renderPostsCards(posts, categories) {
        return (
            <div className='container'>
                <div className="row m-3">
                    <div className="col-md-6"></div>
                    <div className="col-md-6">
                        <select className="form-control" onChange={this.handleChangeCategories}>
                            <option key={0} value={0}>Все посты</option>
                            {categories.map(elem => 
                                <option key={elem.id} value={elem.id}>{elem.title}</option>
                                )}
                        </select>
                    </div>
                </div> 
                <div className='row'>
                    {posts.map(category =>
                        <div className="mb-2 col-md-4 " key={category.id}>
                            <div className="card pt-3" >
                                <div className=''>
                                    <img className="card-img-top" src={category.imgSrc} alt={category.imgAlt} />
                                    <div className="card-body">
                                        <h5 className="card-title text-center">{category.title}</h5>
                                        <p className="card-text text-justify">{category.slogan}</p>
                                        <div className="form-row text-center">
                                            <div className="col-12 text-white">
                                                <a href={"/showOneCategory/" + category.urlSlug} className="btn btn-primary">Подробнее...</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    render() {
        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : this.renderPostsCards(this.state.filteredPosts, this.state.categories);
        return (
            <div>
                <h1 id="tabelLabel" className='text-center'>Все Посты</h1>
                <p className='text-center'>Чтото там.....</p>
                {contents}
            </div>
        );
    }

    async populatePostsData() {

        const currentPage = 5, pageLimit = 3;
        const responsePages = await fetch(`Post?page=${currentPage}&limit=${pageLimit}`, {
            method: 'GET'
        });
        console.log(responsePages.json());


        //методзапроса на сервер
        const response = await fetch('Post', {
            method: 'GET'
        });
        const data = await response.json();                             //ответ конвертим в json

        var cats = data.map(item => item.category);
        var uniquesCats = [];

        for (var i = 0; i < cats.length; i++) {
            var isUnic = true;
            for (var j = 0; j < uniquesCats.length; j++) {
                if (cats[i].id === uniquesCats[j].id) {
                    isUnic = false;
                    break;
                }
            }
            if (isUnic) uniquesCats.push(cats[i]);
        }
        this.setState({ allPosts: data, categories: uniquesCats, filteredPosts:data, loading: false });             //меняем состояние обьекта state - инитим forecasts массив данными с сервера
    }
}
