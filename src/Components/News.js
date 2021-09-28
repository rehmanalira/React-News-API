import React, { Component } from 'react'
import Loading from './Loading';
import NewsItem from './NewsItem'
import PropTypes from 'prop-types'


export default class News extends Component {

    static defaultProps = {
        country: 'nz',
        category: 'science',
        pageSize: 6
    }

    static propTypes = {
        country: PropTypes.string,
        category: PropTypes.string,
        pageSize: PropTypes.number
    }
    constructor() {
        super();
        console.log("Constructor is uSED");
        this.state = {
            articles: [],
            loading: false,
            page: 1
        }
    }


    async updateNews() {
        let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=15b7bfe40ebe4deeaafe8c770b9802de&page=${this.state.page}&pageSize=${this.props.pageSize}`;
        this.setState({ loading: true })
        let data = await fetch(url);
        let parseData = await data.json();
        // console.log(parseData);

        this.setState({
            articles: parseData.articles,
            totalResult: parseData.totalResult,
            loading: false
        });
    }

    async componentDidMount() {
        this.updateNews();
    }

    handleNext = async () => {
        console.log("Next...");

        this.setState({ page: this.state.page + 1 })
        this.updateNews();

    }
    handlePrevious = async () => {
        console.log("Previos...");


        this.setState({ page: this.state.page - 1 })
        this.updateNews();

    }
    render() {
        return (
            <div className="container">
                <h1 className="text-center" style={{ fontweight: "bold" }}>Top 10 News From India</h1>
                {this.state.loading && <Loading />}
                {this.state.articles.source ? this.state.articles.source : ''}
                <div className="row my-3 ">
                    {!this.state.loading && this.state.articles.map((element) => {

                        return <div className="col-md-3 my-3 " key={element.url}>
                            <NewsItem title={element.title} desc={element.description} newsUrl={element.url} date={element.publishedAt} source={element.source.name} author={element.author} imageUrl={element.urlToImage} />
                        </div>

                    })};

                </div>
                <div className="container d-flex justify-content-between">
                    <button disabled={this.state.page <= 1} type="button" className="btn btn-success" onClick={this.handlePrevious}>Previous &larr;</button>
                    <button disabled={this.state.page + 1 > Math.ceil(this.state.totalResult / this.props.pageSize)} type="button" className="btn btn-success" onClick={this.handleNext}>Next &rarr;</button >

                </div>
            </div>

        )
    }
}
